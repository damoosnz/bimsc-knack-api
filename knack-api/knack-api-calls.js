import KnackAPI from 'knack-api-helper';
import { knackApiInit } from './knack-api-init.js'
import { knackApi } from '../index.js';

// get
async function knackApiViewGetSingle(payload, config) {
    const knackAPI = await knackApiInit(config)
    console.log('api call started for getSingle()')
    try {
        const response = await knackAPI.get(payload)
        console.log("api call completed for getSingle()")
        const responseJson = response.json
        return responseJson
    } catch (err) {
        console.log("api call failed for getSingle()", err)
        return null;
    }
}

async function knackApiViewGetMany(payload, config) {
    const knackAPI = await knackApiInit(config)
    console.log("api call started for getMany()")
    try {
        const resRecords = await knackAPI.getMany(payload);
        console.log("api call completed for getMany()")
        return resRecords.records
    } catch (err) {
        console.log("api call failed for getMany()", err)
        return null;
    }
}

// browser only for the moment
async function knackApiViewGetManyParentRecord(payload) {

    const basePayload = payload
    var iteration = 1
    var iterationUrl = `&page=${iteration}&rows_per_page=1000`
    var currentPayload = basePayload + iterationUrl
    var headers = {
        'Authorization': Knack.getUserToken(),
        'X-Knack-REST-API-Key': 'knack',
        'X-Knack-Application-Id': Knack.application_id,
        'Content-Type': 'application/json'
    };
    var response = {}

    var responseJson = await fetchAPIcall(currentPayload, headers)
    response = { ...responseJson }

    if (responseJson.total_records > 1000) {
        const numIteration = responseJson.total_pages
        for (var i = 2; i <= numIteration; i++) {
            var iteration = i
            var iterationUrl = `&page=${iteration}&rows_per_page=1000`
            var currentPayload = basePayload + iterationUrl
            responseJson = await fetchAPIcall(currentPayload, headers)
            response.records = [...response.records, ...responseJson.records];
        }
    }

    return response

}

// post

async function knackApiViewPostMany(payload, chunksSize = 100, config) {

    console.log("api call started for postMany()")

    const records = payload.records
    const numRecords = records.length
    const recPerBatch = chunksSize
    const numBatches = Math.ceil(numRecords / recPerBatch)
    const batches = []

    for (var i = 0; i < numBatches; i++) {

        const batch = records.slice(i * recPerBatch, (i + 1) * recPerBatch)
        batches.push(batch)
    }

    const resArray = []
    let curBatch = 0

    for (var batch of batches) {

        curBatch += 1
        console.log(`processing batch ${curBatch} of ${numBatches}`)

        const knackAPI = await knackApiInit(config)
        const batchPayload = knackApi.payloads.postMany(payload.scene, payload.view, batch)
        try {
            const responses = await knackAPI.postMany(batchPayload);
            if (responses.summary.rejected > 0) {
                responses.summary.errors.forEach(err => {
                    console.log(JSON.stringify(err.reason));
                })
            }

            resArray.push(responses)
            // return responses
        } catch (err) {
            console.log("api call failed  for postMany()", err)
            return null;
        }
    }

    console.log("api call completed for postMany()")

    const result = combineResponses(resArray)
    return result

}

async function knackApiViewPostSingle(payload, config) {
    const knackAPI = await knackApiInit(config)
    console.log("api call started for postSingle()")
    try {
        const response = await knackAPI.post(payload);
        const recordCreated = response.json;
        console.log("api call completed for postSingle()")
        return recordCreated
    } catch (err) {
        console.log("api call failed for postSingle()", err)
        return null;
    }
}

// put
async function knackApiViewPutSingle(payload, config) {
    const knackAPI = await knackApiInit(config)
    console.log("api call started for putSingle()")
    try {
        const response = await knackAPI.put(payload);
        const responseJson = await response.json
        console.log("api call completed for putSingle()")
        return responseJson
    } catch (err) {
        console.log("api call failed for putSingle()", err)
        return null;
    }
}

async function knackApiViewPutMany(payload, chunksSize = 100, config) {


    console.log("api call started for putMany()")

    const records = payload.records
    const numRecords = records.length
    const recPerBatch = chunksSize
    const numBatches = Math.ceil(numRecords / recPerBatch)
    const batches = []

    for (var i = 0; i < numBatches; i++) {

        const batch = records.slice(i * recPerBatch, (i + 1) * recPerBatch)
        batches.push(batch)
    }

    const resArray = []
    let curBatch = 0

    for (var batch of batches) {

        curBatch += 1
        console.log(`processing batch ${curBatch} of ${numBatches}`)

        const knackAPI = await knackApiInit(config)
        const batchPayload = knackApi.payloads.putMany(payload.scene, payload.view, batch)
        try {
            const responses = await knackAPI.putMany(batchPayload);
            if (responses.summary.rejected > 0) {
                responses.summary.errors.forEach(err => {
                    console.log(JSON.stringify(err.reason));
                })
            }

            resArray.push(responses)
            // return responses
        } catch (err) {
            console.log("api call failed for putMany()", err)
            return null;
        }
    }

    console.log("api call completed for putMany()")

    const result = combineResponses(resArray)
    return result

}

// delete
async function knackApiViewDeleteSingle(payload, config) {
    const knackAPI = await knackApiInit(config)
    console.log("api call started for deleteSingle()")
    try {
        const response = await knackAPI.delete(payload)
        console.log("api call completed for deleteSingle()")
        return response
    } catch (err) {
        console.log("api call failed for deleteSingle()", err)
        return null;
    }
}

// report in browser only for filters
async function knackApiViewGetFromReport(payload, config) {

    if (payload.filters) {

        console.log("api call made from url for getReport()")

        var headers = {
            'Authorization': Knack.getUserToken(),
            'X-Knack-REST-API-Key': 'knack',
            'X-Knack-Application-Id': Knack.application_id,
            'Content-Type': 'application/json'
        };

        var responseJson = await fetchAPIcall(payload.url, headers)
        var records = responseJson.report.records
        console.log("api call completed from url for getReport()")
        return records

    } else {

        const knackAPI = await knackApiInit(config)

        console.log("api call started for getReport()")

        try {

            const reportDataResponse = await knackAPI.getFromReportView(payload)
            console.log("api call completed for getReport()")
            const response = reportDataResponse.json.reports[0].records
            return response

        } catch (err) {
            console.log("api call failed for getReport()", err)
            return null;
        }

    }



}

// uplaod file/image asset in browser only for the moment
async function knackUploadAsset(file) {

    var url = `https://api.knack.com/v1/applications/${Knack.application_id}/assets/file/upload`

    const formData = new FormData();
    formData.append('files', file)

    var options = {
        'method': 'POST',
        'headers': {
            'X-Knack-REST-API-Key': 'knack',
            'X-Knack-Application-Id': Knack.application_id,
        },
        'body': formData
    };

    var response = await fetch(url, options);
    console.log(response)
    var result = await response.json()
    console.log(result)
    return { id: result.id, url: result.public_url }

}

async function fetchAPIcall(payload, headers) {
    console.log("api call started")
    try {
        const response = await fetch(payload, {
            method: 'GET',
            headers,
        });
        const responseJson = await response.json();
        console.log("api call completed")
        return responseJson
    } catch (err) {
        console.log("api call failed")
        console.log("err", err)
        return err
    }
}

function combineResponses(resArray) {

    let combinedObjects = [];
    let mergedSettings = { records: [], scene: '', view: '' };
    let mergedSummary = { errors: [], fulfilled: 0, rejected: 0 };

    // Assuming the first array has the correct scene and view (as they are the same)    
    mergedSettings.scene = resArray[0].settings.scene;
    mergedSettings.view = resArray[0].settings.view;

    // Loop through each array in arrayOfArrays
    for (let arr of resArray) {
        // Merge objects (excluding the last element which is settings and summary)
        combinedObjects = [...combinedObjects, ...arr];

        // Merge settings - concatenate the record arrays
        mergedSettings.record = [...mergedSettings.records, ...arr.settings.records];

        // Merge summary
        mergedSummary.errors = [...mergedSummary.errors, ...arr.summary.errors];
        mergedSummary.fulfilled += arr.summary.fulfilled;
        mergedSummary.rejected += arr.summary.rejected;
    }

    // Add the merged settings and summary to the combined array
    combinedObjects.settings = mergedSettings
    combinedObjects.summary = mergedSummary

    return combinedObjects;

}

export const calls = {
    // get
    getSingle: (payload, config) => knackApiViewGetSingle(payload, config),
    getMany: (payload, config) => knackApiViewGetMany(payload, config),
    getManyParentRecord: (payload) => knackApiViewGetManyParentRecord(payload),
    // post
    postSingle: (payload, config) => knackApiViewPostSingle(payload, config),
    postMany: (payload, chunksSize, config) => knackApiViewPostMany(payload, chunksSize, config),
    //put
    putMany: (payload, chunksSize, config) => knackApiViewPutMany(payload, chunksSize, config),
    putSingle: (payload, config) => knackApiViewPutSingle(payload, config),
    // delete
    deleteSingle: (payload, config) => knackApiViewDeleteSingle(payload, config),

}



async function knackApiViewPutManyArchived(payload) {
    const knackAPI = await knackApiInit()
    console.log("api call started")
    try {
        const responses = await knackAPI.putMany(payload);
        if (responses.summary.rejected > 0) {
            res.summary.errors.forEach(err => {
                errorHandler(err.reason);
            })
        }
        console.log("api call completed")
        return responses
    } catch (err) {
        console.log("api call failed", err)
        return null;
    }
}

async function knackApiViewPostManyArchived(payload) {


    const knackAPI = await knackApiInit()
    console.log("api call started")
    try {
        const responses = await knackAPI.postMany(payload);
        if (responses.summary.rejected > 0) {
            responses.summary.errors.forEach(err => {
                console.log(JSON.stringify(err.reason));
            })
        }
        console.log("api call completed")
        return responses
    } catch (err) {
        console.log("api call failed", err)
        return null;
    }
}