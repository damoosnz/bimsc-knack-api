function createKnackApiConfig(nickName, runEnv, app_id, login, password) {
    return {
        [nickName]: {
            runEnv: runEnv,
            app_id: app_id,
            login: login || '',
            password: password || ''
        }
    }
}



function initKnackApiConfig(userConfigs = []) {

    const defaultConfig = {
        default: {
            runEnv: process.env.KNACK_API_RUNENV,
            app_id: process.env.KNACK_APP_ID,
            login: process.env.KNACK_API_LOGIN || '',
            password: process.env.KNACK_API_PASSWORD || ''
        }

    }

    let configs = [defaultConfig]
    if (userConfigs.length > 0)
        userConfigs.forEach(config => { configs, push(config) });
    return configs

}

function checkDefaultConfig() {

    // check if the runEnv is defined
    const runEnv = process.env.KNACK_API_RUNENV
    if (!runEnv) {
        console.log('runEnv is not specified')
        return false
    }

    if (runEnv !== 'browser' && runEnv !== 'server') {
        console.log('runEnv must be either browser or server')
        return false
    }

    if (runEnv === 'browser') {
        return true
    }

    if (runEnv === 'server') {
        // check application id
        const applicationId = process.env.KNACK_APP_ID
        if (!applicationId) {
            console.log('application id must be specified')
            return false
        }

        const email = process.env.KNACK_API_LOGIN
        if (!email) {
            console.log('login must be specified')
            return false
        }

        const password = process.env.KNACK_API_PASSWORD
        if (!password) {
            console.log('password must be specified')
            return false
        }

        return true
    }

    console.log('config is incorrect')
    return false

}


export const config = {
    create: (runEnv, app_id, login, password) => createKnackApiConfig(runEnv, app_id, login, password),
    init: (userConfigs) => initKnackApiConfig(userConfigs),
    checkDefault: () => checkDefaultConfig()
}