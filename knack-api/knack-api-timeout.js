export const timeout = {
    set: (duration = 5 * 60 * 1000) => setApiCallTImeLimit(duration)
};

function setApiCallTImeLimit(duration) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Update process timed out after " + (duration / (1000*60)) + " minutes");  // Resolve with a message
        }, duration);
    });
}
