import { logViolation } from "../core/violationLogger.js";

let sideLookCount = 0;
let downLookCount = 0;

const LOOK_THRESHOLD = 5;
let lastSuspiciousGazeTime = 0;
let inputHandler;
let clickHandler;
let gazeDirection = null; // Track "left" or "right"

export function startGazeDetection() {
    console.log("Gaze detection listeners started");

    inputHandler = checkAnswerCorrelation;
    document.addEventListener("input", inputHandler);

    clickHandler = (e) => {
        if (
            e.target.tagName === "INPUT" ||
            e.target.tagName === "LABEL" ||
            e.target.closest("label")
        ) {
            checkAnswerCorrelation();
        }
    };
    document.addEventListener("click", clickHandler);
}

function checkAnswerCorrelation() {
    if (Date.now() - lastSuspiciousGazeTime < 3000) {
        logViolation(
            "AI Tool Suspected: Answer immediately after off-screen gaze",
            3
        );
        lastSuspiciousGazeTime = 0;
    }
}

export function processGaze(detection) {
    if (!detection) {
        sideLookCount = 0;
        downLookCount = 0;
        return;
    }
    const landmarks = detection.landmarks;
    const nose = landmarks.getNose();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const jaw = landmarks.getJawOutline();

    if (!nose || !leftEye || !rightEye || !jaw) return;

    const noseX = nose[3].x;
    const leftEyeX = leftEye[0].x;
    const rightEyeX = rightEye[3].x;

    const ratio = (noseX - leftEyeX) / (rightEyeX - leftEyeX);
    let gazeTriggered = false;

    // SIDE LOOK DETECTION
    if (ratio < 0.35) {
        sideLookCount++;
        gazeTriggered = true;
        gazeDirection = "left";
    } else if (ratio > 0.65) {
        sideLookCount++;
        gazeTriggered = true;
        gazeDirection = "right";
    } else {
        sideLookCount = Math.max(0, sideLookCount - 1);
    }
    // DOWN LOOK DETECTION
    const noseY = nose[3].y;
    const eyeTop = Math.min(leftEye[0].y, rightEye[0].y);
    const chin = jaw[8].y;

    const distTop = Math.abs(noseY - eyeTop);
    const distBottom = Math.abs(chin - noseY);

    if (distTop === 0) return;
    const pitchRatio = distBottom / distTop;

    if (pitchRatio < 0.6) {
        downLookCount++;
        gazeTriggered = true;

    } else {
        downLookCount = Math.max(0, downLookCount - 1);
    }
    if (gazeTriggered) {
        lastSuspiciousGazeTime = Date.now();
    }
    // LOG VIOLATIONS
    if (sideLookCount >= LOOK_THRESHOLD) {
        const dirText = gazeDirection === "left" ? "left" : "right";
        logViolation(
            `Suspicious Gaze: Candidate looking ${dirText} (Possible AI tool)`,
            2
        );
        sideLookCount = 0;
    }
    if (downLookCount >= LOOK_THRESHOLD) {
        logViolation(
            "Suspicious Gaze: Looking down repeatedly (Possible phone usage)",
            2
        );
        downLookCount = 0;
    }
}

export function stopGazeDetection() {
    if (inputHandler) {
        document.removeEventListener("input", inputHandler);
    }
    if (clickHandler) {
        document.removeEventListener("click", clickHandler);
    }
}