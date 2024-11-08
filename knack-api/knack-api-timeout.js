export const timeout = {
    set: (duration = 5 * 60 * 1000) => setApiCallTImeLimit(duration)
};

function setApiCallTImeLimit(duration) {

    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Update process timed out after 5 minutes"));
        }, duration);
    });
}
