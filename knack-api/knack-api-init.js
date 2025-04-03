import KnackAPI from 'knack-api-helper';

export async function knackApiInit(config = undefined) {

    const runInBrowser = typeof window !== "undefined";
    const runOnServer = !runInBrowser;

    if (runInBrowser) {
        return new KnackAPI({
            auth: 'view-based',
            applicationId: Knack.application_id,
            userToken: Knack.getUserToken()
        });
    }

    if (runOnServer) {

        let knackAppId = process.env.KNACK_APP_ID
        let knackLogin = process.env.KNACK_API_LOGIN
        let knackPassword = process.env.KNACK_API_PASSWORD

        if (config) {
            knackAppId = config.app_id
            knackLogin = config.login
            knackPassword = config.password
        }

        const userToken = await knackLogin(knackAppId, knackLogin, knackPassword )
        return new KnackAPI({
            auth: 'view-based',
            applicationId: process.env.KNACK_APP_ID,
            userToken: userToken
        });
    }

}

// login

async function knackLogin(knackAppId, knackLogin, knackPassword ) {

    //Initialize without a user token
    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: knackAppId,
    });

    //Now we remotely login to Knack to obtain a user token & append it to knackAPI
    try {
        return await knackAPI.login({
            email: knackLogin,
            password: knackPassword
        });

        //Now you can run knackAPI methods authenticated as the user you logged in as!

    } catch (err) {
        console.log(err);
    }
}