let startTime = null;

export function startTimer() {
    startTime = Date.now();
}

export function getDuration() {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
}