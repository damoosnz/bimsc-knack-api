var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/node-fetch/browser.js
var require_browser = __commonJS({
  "node_modules/node-fetch/browser.js"(exports, module) {
    "use strict";
    var getGlobal = function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    };
    var globalObject = getGlobal();
    module.exports = exports = globalObject.fetch;
    if (globalObject.fetch) {
      exports.default = globalObject.fetch.bind(globalObject);
    }
    exports.Headers = globalObject.Headers;
    exports.Request = globalObject.Request;
    exports.Response = globalObject.Response;
  }
});

// node_modules/@callum.boase/fetch/_fetch.js
var require_fetch = __commonJS({
  "node_modules/@callum.boase/fetch/_fetch.js"(exports, module) {
    if (inBrowser()) {
      fetch2 = window.fetch;
    } else {
      fetch2 = require_browser();
    }
    var fetch2;
    function inBrowser() {
      try {
        window.fetch;
        return true;
      } catch (err) {
        return false;
      }
    }
    var _fetch = {
      delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },
      tools: {
        exponentialBackoff(attempt) {
          return Math.pow(2, attempt - 1) * 1e3;
        }
      },
      defaults: {
        retryDelay(attempt, mostRecentErr) {
          if (mostRecentErr.details.response.status === 429) {
            return Math.pow(2, attempt - 1) * 1e3;
          } else {
            return 1e3;
          }
        },
        retryOn(attempt, err) {
          if (err.details && err.details.response && (err.details.response.status >= 500 || err.details.response.status === 429)) {
            return true;
          } else {
            return false;
          }
        }
      },
      async wrapper(url2, options2 = {}, helperData2 = {}) {
        try {
          const response = await fetch2(url2, options2);
          const text = await response.text();
          let json = null;
          if (isJson(text)) {
            json = JSON.parse(text);
          }
          if (response && response.ok) {
            return { url: url2, options: options2, response, helperData: helperData2, json, text };
          }
          let err = new Error(`Successful http request but response.ok === false. Code: ${response.status}, Text: ${text}`);
          err.details = { url: url2, options: options2, response, helperData: helperData2, json, text };
          throw err;
        } catch (err) {
          !err.details ? err.details = { url: url2, options: options2, helperData: helperData2 } : err.datails;
          throw err;
        }
        function isJson(text) {
          try {
            JSON.parse(text);
            return true;
          } catch (err) {
            return false;
          }
        }
      },
      async one(settings = { url, options, helperData, retries, retryDelay, retryOn }) {
        if (typeof settings !== "object" || !settings.url) throw new Error("Invalid argument when calling _fetch.one. You must call _fetch.one with an object (settings), containing at-minimum: settings = {url: string}");
        if (!settings.options) settings.options = { method: "GET" };
        if (settings.options && !settings.options.method) settings.options.method = "GET";
        if (!settings.retries && settings.retries !== 0) settings.retries = 5;
        if (typeof settings.retryDelay !== "function" && typeof settings.retryDelay !== "number") {
          settings.retryDelay = this.defaults.retryDelay;
        }
        if (typeof settings.retryOn !== "function") {
          settings.retryOn = this.defaults.retryOn;
        }
        let mostRecentErr;
        for (let i = 0; i <= settings.retries; i++) {
          try {
            if (i > 0) {
              let retryDelay2;
              if (typeof settings.retryDelay === "function") {
                retryDelay2 = settings.retryDelay(i, mostRecentErr);
              } else {
                retryDelay2 = settings.retryDelay;
              }
              await this.delay(retryDelay2);
            }
            return await this.wrapper(settings.url, settings.options, settings.helperData);
          } catch (err) {
            const isLastRetry = i === settings.retries;
            if (isLastRetry) throw err;
            const shouldRetry = await settings.retryOn(i, err);
            if (!shouldRetry) throw err;
            mostRecentErr = err;
            console.log(`failed fetch ${settings.options.method} to ${settings.url}. Code: ${err.details && err.details.response ? err.details.response.status : ""}. Attempt ${i}. Retrying...`);
          }
        }
      },
      async many(settings = { requests, delayMs, progressCbs }) {
        if (!settings.delayMs) settings.delayMs = 125;
        let promises = [];
        settings.requests.forEach((request, i) => {
          const promise = (async () => {
            await this.delay(i * settings.delayMs);
            const fetchResult = await this.one({
              url: request.url,
              options: request.options,
              retries: request.retries,
              retryDelay: request.retryDelay,
              retryOn: request.retryOn,
              helperData: { request, delayMs: i * settings.delayMs, i }
            });
            progress++;
            if (settings.progressCbs && settings.progressCbs.length) {
              settings.progressCbs.forEach((progressCb) => {
                progressCb(progress, len, fetchResult);
              });
            }
            return fetchResult;
          })();
          promises.push(promise);
        });
        const len = promises.length;
        let progress = 0;
        return Promise.allSettled(promises);
      }
    };
    if (typeof __require != "undefined") module.exports = _fetch;
  }
});

// node_modules/knack-api-helper/knack-api-helper.js
var require_knack_api_helper = __commonJS({
  "node_modules/knack-api-helper/knack-api-helper.js"(exports, module) {
    var _fetch = require_fetch();
    function KnackAPI3(config) {
      checkConfig();
      if (config.auth === "view-based") {
        this.headers = {
          "X-Knack-Application-ID": config.applicationId,
          "X-Knack-REST-API-Key": "knack",
          "Authorization": typeof config.userToken === "string" ? config.userToken : "",
          "Content-Type": "application/json"
        };
      } else if (config.auth === "object-based") {
        this.headers = {
          "X-Knack-Application-ID": config.applicationId,
          "X-Knack-REST-API-Key": config.apiKey,
          "Content-Type": "application/json"
        };
      }
      this.urlBase = `https://api.knack.com/v1`;
      this.remoteLogin = async function(settings = { email, password }) {
        return await _fetch.one({
          url: `${this.urlBase}/applications/${this.headers["X-Knack-Application-ID"]}/session`,
          options: {
            method: "POST",
            body: JSON.stringify({
              email: settings.email,
              password: settings.password
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        });
      };
      this.login = async function(settings = { email, password }) {
        if (settings.email && settings.password) {
          const res2 = await this.remoteLogin(settings);
          const token = res2.json.session.user.token;
          this.headers.Authorization = token;
          return token;
        } else {
          throw new Error("You did not specify one/both of email and password in settings object. Could not log in");
        }
      }, this.validateSession = async function(settings = { userToken, userRoleCheck }) {
        if (typeof settings.userToken !== "string") {
          throw new Error("You must provide a settings object with at least a userToken (string) to validateSession()");
        }
        try {
          const response = await _fetch.one({
            url: `${this.urlBase}/session/token`,
            options: {
              method: "GET",
              headers: {
                "Authorization": settings.userToken,
                "x-knack-application-id": this.headers["X-Knack-Application-ID"]
              }
            }
          });
          const session = response.json?.session;
          if (!session) throw new Error("No session found");
          if (session.user.status !== "current") throw new Error("Valid user but session not current.");
          if (session.user.account_status !== "active") throw new Error("Valid user but status not active.");
          if (session.user.approval_status !== "approved") throw new Error("Valid user but approval status is not approved.");
          if (settings.userRoleCheck) {
            if (!session.user.profile_keys.includes(settings.userRoleCheck)) {
              throw new Error("Valid user but does not include the specified user role.");
            }
          }
          return true;
        } catch (err) {
          return false;
        }
      }, this.url = function(settings = { scene, view, object, recordId }) {
        let url2 = this.urlBase;
        if (config.auth === "view-based") {
          url2 += `/pages/${settings.scene}/views/${settings.view}/records/`;
        } else if (config.auth === "object-based") {
          url2 += `/objects/${settings.object}/records/`;
        }
        if (settings.recordId) url2 += settings.recordId;
        return url2;
      };
      this.getRetries = function(retries2) {
        if (typeof retries2 === "number") {
          return retries2;
        } else {
          return 5;
        }
      };
      this.setup = function(method, settings) {
        let url2 = "";
        if (config.auth === "view-based") {
          url2 = this.url({
            scene: settings.scene,
            view: settings.view,
            recordId: settings.recordId
          });
        } else if (config.auth === "object-based") {
          url2 = this.url({
            object: settings.object,
            recordId: settings.recordId
          });
        }
        const options2 = {
          method,
          headers: this.headers
        };
        if (settings.body) options2.body = JSON.stringify(settings.body);
        const retries2 = this.getRetries(settings.retries);
        return { url: url2, options: options2, retries: retries2, helperData: settings.helperData };
      };
      this.single = async function(method, settings) {
        const req = this.setup(method, settings);
        return await _fetch.one(req);
      };
      this.many = async function(method, settings) {
        if (method === "GET") return console.log("knackAPI.many is only for POST, PUT and DELETE");
        const requests2 = [];
        settings.records.forEach((record) => {
          const reqSettings = {
            view: settings.view,
            scene: settings.scene,
            object: settings.object,
            retries: settings.retries
          };
          if (method !== "DELETE") {
            reqSettings.body = record;
          }
          if (method !== "POST") {
            reqSettings.recordId = record.id;
          }
          requests2.push(this.setup(method, reqSettings));
        });
        if (settings.resultsReport) this.tools.manyResultsReport.remove(settings.resultsReport);
        const progressCbs2 = this.progressCbsSetup(settings);
        const results = await _fetch.many({ requests: requests2, delayMs: 125, progressCbs: progressCbs2 });
        results.settings = settings;
        results.summary = this.tools.manyResultsReport.calc(results);
        if (settings.resultsReport) {
          this.tools.manyResultsReport.create(settings.resultsReport, results);
        }
        return results;
      };
      this.progressCbsSetup = function(settings) {
        let progressCbs2 = [];
        if (settings.progressBar) {
          this.tools.progressBar.create(settings.progressBar);
          progressCbs2.push((progress, len, fetchResult) => {
            this.tools.progressBar.update(settings.progressBar.id, progress, len);
          });
        }
        if (settings.progressCbs && settings.progressCbs.length) {
          settings.progressCbs.forEach((progressCb) => progressCbs2.push(progressCb));
        }
        return progressCbs2;
      };
      this.get = async function(settings = { view, scene, object, recordId, helperData }) {
        return await this.single("GET", settings);
      };
      this.post = async function(settings = { view, scene, object, body, helperData, retries }) {
        return await this.single("POST", settings);
      };
      this.put = async function(settings = { recordId, view, scene, object, body, helperData, retries }) {
        return await this.single("PUT", settings);
      };
      this.delete = async function(settings = { recordId, view, scene, object, helperData, retries }) {
        return await this.single("DELETE", settings);
      };
      this.getMany = async function(settings = { view, scene, object, filters, rowsPerpage, startAtPage, maxRecordsToGet, helperData }, currentPage = 1, final = { records: [], pages: [] }) {
        const req = this.setup("GET", settings);
        if (currentPage === 1) {
          if (settings.startAtPage > 1) currentPage = settings.startAtPage;
        }
        const maxRecordsToGet2 = settings.maxRecordsToGet > 0 ? settings.maxRecordsToGet : Infinity;
        let rowsPerPage = settings.rowsPerPage ? settings.rowsPerPage : 1e3;
        req.url += `?page=${currentPage}&rows_per_page=${rowsPerPage}`;
        if (settings.format) req.url += `&format=${settings.format}`;
        if (settings.filters) req.url += `&filters=${JSON.stringify(settings.filters)}`;
        const result = await _fetch.one(req);
        final.pages.push(result);
        result.json.records.map((record) => final.records.push(record));
        final.helperData = settings.helperData;
        if (final.records.length > maxRecordsToGet2) {
          final.records = final.records.splice(0, maxRecordsToGet2);
        }
        if (final.records.length < maxRecordsToGet2 && result.json.current_page < result.json.total_pages) {
          return await this.getMany(settings, result.json.current_page + 1, final);
        } else {
          return final;
        }
      };
      this.putMany = async function(settings = { records, view, scene, object, helperData, retries, progressBar, progressCbs, resultsReport }) {
        return await this.many("PUT", settings);
      };
      this.postMany = async function(settings = { records, view, scene, object, helperData, retries, progressBar, progressCbs, resultsReport }) {
        return await this.many("POST", settings);
      };
      this.deleteMany = async function(settings = { records, view, scene, object, helperData, retries, progressBar, progressCbs, resultsReport }) {
        return await this.many("DELETE", settings);
      };
      this.getFromReportView = async function(settings = { view, scene, sceneRecordId, helperData, retries }) {
        if (config.auth !== "view-based") throw new Error("getFromReportView() only works when using view-based auth");
        if (!settings.view || !settings.scene) throw new Error("getFromReportView() requires a view and scene. You did not specify one or both.");
        if (settings.recordId) throw new Error(`getFromReportView() does not support recordId. Specify settings.sceneRecordId if you are trying to load a report on a child page that has the data source of "this page's record" or similar.`);
        let url2 = `${this.urlBase}/scenes/${settings.scene}/views/${settings.view}/report`;
        if (settings.sceneRecordId) {
          const sceneSlug = await this.getSceneSlug(settings.scene);
          url2 += `?${sceneSlug}_id=${settings.sceneRecordId}`;
        }
        const req = {
          url: url2,
          options: {
            method: "GET",
            headers: this.headers
          },
          retries: this.getRetries(settings.retries),
          helperData: settings.helperData
        };
        return await _fetch.one(req);
      };
      this.tools = {
        progressBar: {
          html(id) {
            return $(`
                    <div id="${id}" style="margin-bottom: 10px;">
                        <span class="before-progress-bar" style="margin-right: 5px;"><em><strong>Processing records</em></strong></span>
                        <progress id="progressBar" value="0" max="100"></progress>
                        <span class="after-progress-bar" style="margin-left: 5px;" id="progressText">Initialising...</span>
                    </div>
                `);
          },
          update(id, progress, len) {
            $(`#${id} #progressBar`).val(Math.round(progress / len * 100));
            $(`#${id} #progressText`).text(`${progress}/${len}`);
          },
          create(progressBar2) {
            $(`#${progressBar2.id}`).remove();
            if (progressBar2.insertAfter) {
              this.html(progressBar2.id).insertAfter(progressBar2.insertAfter);
            } else if (progressBar2.insertBefore) {
              this.html(progressBar2.id).insertBefore(progressBar2.insertBefore);
            } else if (progressBar2.appendTo) {
              this.html(progressBar2.id).appendTo(progressBar2.appendTo);
            } else if (progressBar2.prependTo) {
              this.html(progressBar2.id).prependTo(progressBar2.prependTo);
            } else {
              console.log("Invalid progress bar location");
            }
          }
        },
        manyResultsReport: {
          calc(results) {
            const fulfilled = results.reduce((acc, curr) => {
              if (curr.status === "fulfilled") acc++;
              return acc;
            }, 0);
            const rejected = results.reduce((acc, curr) => {
              if (curr.status === "rejected") acc++;
              return acc;
            }, 0);
            const errors = results.filter((result) => {
              if (result.status !== "fulfilled") {
                return true;
              } else {
                return false;
              }
            });
            return { fulfilled, rejected, errors };
          },
          html(id, results) {
            const summary = this.calc(results);
            return $(`
                    <div id=${id}>
                        <p><strong>Finished processing</strong></p>
                        <p>Summary:</p>
                        <p>
                            <ul>
                                <li>Failed: ${summary.rejected}</li>
                                <li>Succeeded: ${summary.fulfilled}</li>
                            </ul>
                        </p>
                    </div>
                `);
          },
          create(resultsReport2, results) {
            if (resultsReport2.insertAfter) {
              this.html(resultsReport2.id, results).insertAfter(resultsReport2.insertAfter);
            } else if (resultsReport2.insertBefore) {
              this.html(resultsReport2.id, results).insertBefore(resultsReport2.insertBefore);
            } else if (resultsReport2.appendTo) {
              this.html(resultsReport2.id, results).appendTo(resultsReport2.appendTo);
            } else if (resultsReport2.prependTo) {
              this.html(resultsReport2.id, results).prependTo(resultsReport2.prependTo);
            } else {
              console.log("Invalid summary location");
            }
          },
          remove(resultsReport2) {
            $(`#${resultsReport2.id}`).remove();
          }
        }
      };
      this.getSceneSlug = async function(sceneKey) {
        const appDataUrl = `${this.urlBase}/applications/${this.headers["X-Knack-Application-ID"]}`;
        const appData = await _fetch.one({
          url: appDataUrl,
          options: {
            method: "GET"
          }
        });
        const scenes = appData.json.application.scenes;
        const scene2 = scenes.find((scene3) => scene3.key === sceneKey);
        if (!scene2) throw new Error(`Scene with key ${sceneKey} not found, when trying to find corresponding slug (url). Could not continue.`);
        const slug = scene2.slug;
        if (!slug) throw new Error(`Scene with key ${sceneKey} found, but no slug (url) found. Could not continue.`);
        return slug;
      };
      function checkConfig() {
        if (!config) throw new Error("KnackAPI config settings object not found");
        if (!config.auth) throw new Error("KnackAPI.auth configuration not found");
        if (config.auth !== "object-based" && config.auth !== "view-based") {
          throw new Error(`KnackAPI.auth invalid - should be "view-based" or "object-based" but got "${config.auth}"`);
        }
        if (!config.applicationId) throw new Error(`KnackAPI.applicationId not found`);
        if (config.auth === "object-based" && !config.apiKey) throw new Error("Object-based auth selected but did not find an API key");
        try {
          if (config.auth === "object-based" && Knack) {
            console.log(`
                    Warning! Object-based auth selected but it looks like you are running code in the Knack Javascript area. 
                    We strongly recommend you use view-based auth instead;
                `);
          }
        } catch (err) {
        }
      }
    }
    module.exports = KnackAPI3;
  }
});

// knack-api/knack-api-payloads.js
function createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    recordId: record_id,
    body: recordData
  };
  return payload;
}
function createApiPayloadPutMany(sceneKey, viewKey, records2, progress) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    records: records2
  };
  return payload;
}
function createApiPayloadPostSingle(sceneKey, viewKey, record) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    body: record
  };
  return payload;
}
function createApiPayloadPostMany(sceneKey, viewKey, records2) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    records: records2
  };
  return payload;
}
function createApiPayloadGetSingle(sceneKey, viewKey, record_id) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    recordId: record_id
  };
  return payload;
}
function createApiPayloadGetMany(sceneKey, viewKey, filters3, parentRecord, format) {
  if (parentRecord) {
    var url2 = `https://api.knack.com/v1/pages/${sceneKey}/views/${viewKey}/records?${parentRecord.name}_id=${parentRecord.id}`;
    if (filters3) {
      url2 += "&filters=" + encodeURIComponent(JSON.stringify(filters3));
    }
    return url2;
  } else {
    if (!format) {
      format = "both";
    }
    const payload = {
      scene: sceneKey,
      view: viewKey,
      format
    };
    if (filters3) {
      payload.filters = filters3;
    }
    return payload;
  }
}
function createApiPayloadDeleteSingle(sceneKey, viewKey, record) {
  const payload = {
    recordId: record.id,
    scene: sceneKey,
    view: viewKey
    //view_21 is a view with a delete link like a grid or details view
  };
  return payload;
}
var payloads = {
  // get
  getSingle: (sceneKey, viewKey, record_id) => createApiPayloadGetSingle(sceneKey, viewKey, record_id),
  getMany: (sceneKey, viewKey, filters3, parentRecord, format) => createApiPayloadGetMany(sceneKey, viewKey, filters3, parentRecord, format),
  // post
  postSingle: (sceneKey, viewKey, record) => createApiPayloadPostSingle(sceneKey, viewKey, record),
  postMany: (sceneKey, viewKey, records2) => createApiPayloadPostMany(sceneKey, viewKey, records2),
  // delete
  deleteSingle: (sceneKey, viewKey, record) => createApiPayloadDeleteSingle(sceneKey, viewKey, record),
  // put
  putSingle: (sceneKey, viewKey, record_id, recordData) => createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData),
  putMany: (sceneKey, viewKey, records2, progress) => createApiPayloadPutMany(sceneKey, viewKey, records2, progress)
};

// knack-api/knack-api-filters.js
function createFilters(condition) {
  return {
    "match": condition,
    "rules": []
  };
}
function Commonfilters(field_key) {
  return {
    isDuringTheCurrentMonth: {
      field: field_key,
      operator: "is during the current",
      type: "month"
    },
    isDuringThePreviousMonth: {
      field: field_key,
      operator: "is during the previous",
      range: "1",
      type: "months"
    },
    isDuringTheNextMonth: {
      field: field_key,
      operator: "is during the next",
      range: "1",
      type: "months"
    },
    isBeforeThePreviousMonth: {
      field: field_key,
      operator: "is before the previous",
      range: "1",
      type: "months"
    }
  };
}
var filters2 = {
  create: (condition) => createFilters(condition),
  common: (field_key) => Commonfilters(field_key)
};

// knack-api/knack-api-calls.js
var import_knack_api_helper2 = __toESM(require_knack_api_helper(), 1);

// knack-api/knack-api-init.js
var import_knack_api_helper = __toESM(require_knack_api_helper(), 1);
async function knackApiInit() {
  const runEnv = "browser";
  if (runEnv === "browser") {
    return new import_knack_api_helper.default({
      auth: "view-based",
      applicationId: Knack.application_id,
      userToken: Knack.getUserToken()
    });
  }
  if (runEnv === "server") {
    const userToken2 = await knackLogin();
    return new import_knack_api_helper.default({
      auth: "view-based",
      applicationId: process.env.KNACK_APP_ID,
      userToken: userToken2
    });
  }
}
async function knackLogin() {
  const knackAPI = new import_knack_api_helper.default({
    auth: "view-based",
    applicationId: process.env.KNACK_APP_ID
  });
  try {
    return await knackAPI.login({
      email: process.env.KNACK_API_LOGIN,
      password: process.env.KNACK_API_PASSWORD
    });
  } catch (err) {
    console.log(err);
  }
}

// knack-api/knack-api-calls.js
async function knackApiViewGetSingle(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const response = await knackAPI.get(payload);
    console.log("api call completed");
    const responseJson = response.json;
    return responseJson;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewGetMany(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const resRecords = await knackAPI.getMany(payload);
    console.log("api call completed");
    return resRecords.records;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewGetManyParentRecord(payload) {
  const basePayload = payload;
  var iteration = 1;
  var iterationUrl = `&page=${iteration}&rows_per_page=1000`;
  var currentPayload = basePayload + iterationUrl;
  var headers = {
    "Authorization": Knack.getUserToken(),
    "X-Knack-REST-API-Key": "knack",
    "X-Knack-Application-Id": Knack.application_id,
    "Content-Type": "application/json"
  };
  var response = {};
  var responseJson = await fetchAPIcall(currentPayload, headers);
  response = { ...responseJson };
  if (responseJson.total_records > 1e3) {
    const numIteration = responseJson.total_pages;
    for (var i = 2; i <= numIteration; i++) {
      var iteration = i;
      var iterationUrl = `&page=${iteration}&rows_per_page=1000`;
      var currentPayload = basePayload + iterationUrl;
      responseJson = await fetchAPIcall(currentPayload, headers);
      response.records = [...response.records, ...responseJson.records];
    }
  }
  return response;
}
async function knackApiViewPostMany(payload) {
  console.log("api call started");
  const records2 = payload.records;
  const numRecords = records2.length;
  const recPerBatch = 100;
  const numBatches = Math.ceil(numRecords / recPerBatch);
  const batches = [];
  for (var i = 0; i < numBatches; i++) {
    const batch2 = records2.slice(i * recPerBatch, (i + 1) * recPerBatch);
    batches.push(batch2);
  }
  const resArray = [];
  let curBatch = 0;
  for (var batch of batches) {
    curBatch += 1;
    console.log(`processing batch ${curBatch} of ${numBatches}`);
    const knackAPI = await knackApiInit();
    const batchPayload = knackApi.payloads.postMany(payload.scene, payload.view, batch);
    try {
      const responses = await knackAPI.putMany(batchPayload);
      if (responses.summary.rejected > 0) {
        responses.summary.errors.forEach((err) => {
          console.log(JSON.stringify(err.reason));
        });
      }
      resArray.push(responses);
    } catch (err) {
      console.log("api call failed", err);
      return null;
    }
  }
  console.log("api call completed");
  const result = combineResponses(resArray);
  return result;
}
async function knackApiViewPostSingle(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const response = await knackAPI.post(payload);
    const recordCreated = response.json;
    console.log("api call completed");
    return recordCreated;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewPutSingle(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const response = await knackAPI.put(payload);
    const responseJson = await response.json;
    console.log("api call completed");
    return responseJson;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewPutMany(payload) {
  console.log("api call started");
  const records2 = payload.records;
  const numRecords = records2.length;
  const recPerBatch = 100;
  const numBatches = Math.ceil(numRecords / recPerBatch);
  const batches = [];
  for (var i = 0; i < numBatches; i++) {
    const batch2 = records2.slice(i * recPerBatch, (i + 1) * recPerBatch);
    batches.push(batch2);
  }
  const resArray = [];
  let curBatch = 0;
  for (var batch of batches) {
    curBatch += 1;
    console.log(`processing batch ${curBatch} of ${numBatches}`);
    const knackAPI = await knackApiInit();
    const batchPayload = knackApi.payloads.putMany(payload.scene, payload.view, batch);
    try {
      const responses = await knackAPI.putMany(batchPayload);
      if (responses.summary.rejected > 0) {
        responses.summary.errors.forEach((err) => {
          console.log(JSON.stringify(err.reason));
        });
      }
      resArray.push(responses);
    } catch (err) {
      console.log("api call failed", err);
      return null;
    }
  }
  console.log("api call completed");
  const result = combineResponses(resArray);
  return result;
}
async function knackApiViewDeleteSingle(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const response = await knackAPI.delete(payload);
    console.log("api call completed");
    return response;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function fetchAPIcall(payload, headers) {
  console.log("api call started");
  try {
    const response = await fetch(payload, {
      method: "GET",
      headers
    });
    const responseJson = await response.json();
    console.log("api call completed");
    return responseJson;
  } catch (err) {
    console.log("api call failed");
    console.log("err", err);
    return err;
  }
}
function combineResponses(resArray) {
  let combinedObjects = [];
  let mergedSettings = { records: [], scene: "", view: "" };
  let mergedSummary = { errors: [], fulfilled: 0, rejected: 0 };
  mergedSettings.scene = resArray[0].settings.scene;
  mergedSettings.view = resArray[0].settings.view;
  for (let arr of resArray) {
    combinedObjects = [...combinedObjects, ...arr];
    mergedSettings.record = [...mergedSettings.records, ...arr.settings.records];
    mergedSummary.errors = [...mergedSummary.errors, ...arr.summary.errors];
    mergedSummary.fulfilled += arr.summary.fulfilled;
    mergedSummary.rejected += arr.summary.rejected;
  }
  combinedObjects.settings = mergedSettings;
  combinedObjects.summary = mergedSummary;
  return combinedObjects;
}
var calls = {
  // get
  getSingle: (payload) => knackApiViewGetSingle(payload),
  getMany: (payload) => knackApiViewGetMany(payload),
  getManyParentRecord: (payload) => knackApiViewGetManyParentRecord(payload),
  // post
  postSingle: (payload) => knackApiViewPostSingle(payload),
  postMany: (payload) => knackApiViewPostMany(payload),
  //put
  putMany: (payload) => knackApiViewPutMany(payload),
  putSingle: (payload) => knackApiViewPutSingle(payload),
  // delete
  deleteSingle: (payload) => knackApiViewDeleteSingle(payload)
};

// knack-api/knack-api-utils.js
var utils = {
  isoTo_MMDDYYYY: (isoDate) => isoDatestoKnackDatesMMDDYYYY(isoDate),
  isoTo_DDMMYYYY: (isoDate) => isoDatestoKnackDatesDDMMYYYY(isoDate)
};
function isoDatestoKnackDatesMMDDYYYY(isoDate) {
  isoDate = new Date(isoDate);
  return {
    date: isoDate.toLocaleDateString("en-US"),
    // Convert to "MM/DD/YYYY" format
    // iso_timestamp: item.creationTime,
    hours: (isoDate.getUTCHours() % 12 || 12).toString().padStart(2, "0"),
    minutes: isoDate.getUTCMinutes().toString().padStart(2, "0"),
    am_pm: isoDate.getUTCHours() >= 12 ? "PM" : "AM"
    // unix_timestamp: isoDate.getTime(),
    // timestamp: isoDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  };
}
function isoDatestoKnackDatesDDMMYYYY(isoDate) {
  isoDate = new Date(isoDate);
  return {
    date: isoDate.toLocaleDateString("en-GB"),
    // Convert to "MM/DD/YYYY" format
    // iso_timestamp: item.creationTime,
    hours: (isoDate.getUTCHours() % 12 || 12).toString().padStart(2, "0"),
    minutes: isoDate.getUTCMinutes().toString().padStart(2, "0"),
    am_pm: isoDate.getUTCHours() >= 12 ? "PM" : "AM"
    // unix_timestamp: isoDate.getTime(),
    // timestamp: isoDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  };
}

// knack-api/knack-api-timeout.js
var timeout = {
  set: (duration = 5 * 60 * 1e3) => setApiCallTImeLimit(duration)
};
function setApiCallTImeLimit(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Update process timed out after " + duration / (1e3 * 60) + " minutes");
    }, duration);
  });
}

// index.js
var knackApi = {
  filters: filters2,
  payloads,
  calls,
  utils,
  timeout
};
export {
  knackApi
};
//# sourceMappingURL=bundle.js.map
