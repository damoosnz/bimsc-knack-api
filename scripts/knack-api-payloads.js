


export function createApiPayloadGetSingle(sceneKey, viewKey, record) {
    const payload = {
        recordId: record.id,
        scene: sceneKey,
        view: viewKey,//view_21 is a view with a delete link like a grid or details view
    }
    return payload
}