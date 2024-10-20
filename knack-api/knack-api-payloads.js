// function to prepare API Payload post many

// Put
function createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData) {
    const payload = {
        scene: sceneKey,
        view: viewKey,
        recordId: record_id,
        body: recordData,
    }
    return payload
}
function createApiPayloadPutMany(sceneKey, viewKey, records, progress) {

    // scene_1709/views/view_4124

    const payload = {
        scene: sceneKey,
        view: viewKey,
        records: records,
    }
    // if (progress) { payload.progressCbs: progress[0].map(callback => (progress, len, fetchResult) => callback(progress, len, fetchResult, progress[1])) }
    return payload

}


// Post
function createApiPayloadPostSingle(sceneKey, viewKey, record) {

    const payload = {
        scene: sceneKey,
        view: viewKey,
        body: record,
    }
    return payload

}
function createApiPayloadPostMany(sceneKey, viewKey, records) {

    // scene_1704/views/view_4122

    const payload = {
        scene: sceneKey,
        view: viewKey,
        records: records
    }
    return payload

}
//get
function createApiPayloadGetSingle(sceneKey, viewKey, record_id) {

    const payload = {
        scene: sceneKey,
        view: viewKey,
        recordId: record_id,
    }
    return payload

}
function createApiPayloadGetMany(sceneKey, viewKey, filters, parentRecord, format) {

    if (parentRecord) {
        var url = `https://api.knack.com/v1/pages/${sceneKey}/views/${viewKey}/records?${parentRecord.name}_id=${parentRecord.id}`
        if (filters) { // Check if filters is not empty
            url += '&filters=' + encodeURIComponent(JSON.stringify(filters)); // Use & instead of ?
        }
        // console.log('params', sceneKey, viewKey, filters , parentRecord , format)
        // console.log('payload', url)
        return url

    } else {

        if (!format) { format = 'both' }
        const payload = {
            scene: sceneKey,
            view: viewKey,
            format: format,
        }
        if (filters) { payload.filters = filters }
        // console.log('params', sceneKey, viewKey, filters , parentRecord , format)
        // console.log('payload', payload)
        return payload
    }
}
//delete
function createApiPayloadDeleteSingle(sceneKey, viewKey, record) {
    const payload = {
        recordId: record.id,
        scene: sceneKey,
        view: viewKey,//view_21 is a view with a delete link like a grid or details view
    }
    return payload
}

//report
function createApiPayloadGetFromReport(sceneKey, viewKey, filters = {}) {

    if (filters) {

        const baseUrl = `https://api.knack.com/v1/scenes/${sceneKey}/views/${viewKey}/report/0`
        const apiUrl = baseUrl + '?filters=' + encodeURIComponent(JSON.stringify(filters));
        return { url: apiUrl, filters: true }

    } else {

        const payload = {
            scene: sceneKey,
            view: viewKey,
        }
        return payload

    }
}

export const payloads = {
    // get
    getSingle: (sceneKey, viewKey, record_id) => createApiPayloadGetSingle(sceneKey, viewKey, record_id),
    getMany: (sceneKey, viewKey, filters, parentRecord, format) => createApiPayloadGetMany(sceneKey, viewKey, filters, parentRecord, format),
    // post
    postSingle: (sceneKey, viewKey, record) => createApiPayloadPostSingle(sceneKey, viewKey, record),
    postMany: (sceneKey, viewKey, records) => createApiPayloadPostMany(sceneKey, viewKey, records),
    // delete
    deleteSingle: (sceneKey, viewKey, record) => createApiPayloadDeleteSingle(sceneKey, viewKey, record),
    // put
    putSingle: (sceneKey, viewKey, record_id, recordData) => createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData),
    putMany: (sceneKey, viewKey, records, progress) => createApiPayloadPutMany(sceneKey, viewKey, records, progress)
};