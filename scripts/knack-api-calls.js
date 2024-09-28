export async function knackApiViewGetSingle(config, payload) {

    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: config.KNACK_APP_ID,
        userToken: config.KNACK_USER_TOKEN
    });

    console.log("api call started")

    try {
        const res = await knackAPI.get(payload);
        console.log("api call completed")
        return res
    } catch (err) {
        console.log("api call failed")
        return err;
    }
}