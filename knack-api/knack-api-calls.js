import KnackAPI from 'knack-api-helper';
import { knackApiInit } from './knack-api-init.js'
import { knackApi } from '../index.js';

// get
async function knackApiViewGetSingle(payload) {
    const knackAPI = await knackApiInit()
    console.log("api call started")
    try {
        const response = await knackAPI.get(payload)
        console.log("api call completed")
        const responseJson = response.json
        return responseJson
    } catch (err) {
        console.log("api call failed", err)
        return null;
    }
}

async function knackApiViewGetMany(payload) {
    const knackAPI = await knackApiInit()
    console.log("api call started")
    try {
        const resRecords = await knackAPI.getMany(payload);
        console.log("api call completed")
        return resRecords.records
    } catch (err) {
        console.log("api call failed", err)
        return null;
    }
}

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

async function knackApiViewPostMany(payload) {

    console.log("api call started")

    const records = payload.records
    const numRecords = records.length
    const recPerBatch = 100
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

        const knackAPI = await knackApiInit()
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
            console.log("api call failed", err)
            return null;
        }
    }

    console.log("api call completed")

    const result = combineResponses(resArray)
    return result

}




async function knackApiViewPostSingle(payload) {
    const knackAPI = await knackApiInit()
    console.log("api call started")
    try {
        const response = await knackAPI.post(payload);
        const recordCreated = response.json;
        console.log("api call completed")
        return recordCreated
    } catch (err) {
        console.log("api call failed", err)
        return null;
    }
}

// put
async function knackApiViewPutSingle(payload) {
    const knackAPI = await knackApiInit()
    console.log("api call started")
    try {
        const response = await knackAPI.put(payload);
        const responseJson = await response.json
        console.log("api call completed")
        return responseJson
    } catch (err) {
        console.log("api call failed", err)
        return null;
    }
}

async function knackApiViewPutMany(payload) {


    console.log("api call started")

    const records = payload.records
    const numRecords = records.length
    const recPerBatch = 100
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

        const knackAPI = await knackApiInit()
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
            console.log("api call failed", err)
            return null;
        }
    }

    console.log("api call completed")

    const result = combineResponses(resArray)
    return result

}

// delete
async function knackApiViewDeleteSingle(payload) {
    const knackAPI = await knackApiInit()
    console.log("api call started")
    try {
        const response = await knackAPI.delete(payload)
        console.log("api call completed")
        return response
    } catch (err) {
        console.log("api call failed", err)
        return null;
    }
}

// report
async function knackApiViewGetFromReport(payload) {

    if (payload.filters) {

        console.log("api call made from url")

        var headers = {
            'Authorization': Knack.getUserToken(),
            'X-Knack-REST-API-Key': 'knack',
            'X-Knack-Application-Id': Knack.application_id,
            'Content-Type': 'application/json'
        };

        var responseJson = await fetchAPIcall(payload.url, headers)
        var records = responseJson.report.records
        return records

    } else {

        const knackAPI = new KnackAPI({
            auth: 'view-based',
            applicationId: Knack.application_id,
            userToken: Knack.getUserToken()
        });

        console.log("api call started")

        try {

            const reportDataResponse = await knackAPI.getFromReportView(payload)
            console.log("api call completed")
            const response = reportDataResponse.json.reports[0].records
            return response

        } catch (err) {
            console.log("api call failed", err)
            return null;
        }

    }



}

// uplaod file/image asset
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
    deleteSingle: (payload) => knackApiViewDeleteSingle(payload),

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