import KnackAPI from 'knack-api-helper';

export async function knackApiInit() {

    const runEnv = process.env.KNACK_API_RUNENV

    if (runEnv === 'browser') {
        return new KnackAPI({
            auth: 'view-based',
            applicationId: Knack.application_id,
            userToken: Knack.getUserToken()
        });
    }

    if (runEnv === 'server') {
        const userToken = await knackLogin()
        return new KnackAPI({
            auth: 'view-based',
            applicationId: process.env.KNACK_APP_ID,
            userToken: userToken
        });
    }
}

// login

async function knackLogin() {

    //Initialize without a user token
    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: process.env.KNACK_APP_ID,
    });

    //Now we remotely login to Knack to obtain a user token & append it to knackAPI
    try {
        return await knackAPI.login({
            email: process.env.KNACK_API_LOGIN,
            password: process.env.KNACK_API_PASSWORD
        });

        //Now you can run knackAPI methods authenticated as the user you logged in as!

    } catch (err) {
        console.log(err);
    }
}