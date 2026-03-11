import { startTabSwitchDetection, stopTabSwitchDetection } from "./browser/tabSwitchDetector.js";
import { startFullscreenDetection, stopFullscreenDetection } from "./browser/fullscreenDetector.js";
import { startCopyPasteDetection, stopCopyPasteDetection } from "./browser/copyPasteDetector.js";
import { setExamStarted } from "./browser/fullscreenDetector.js";

import { startCamera, stopCamera } from "./media/cameraManager.js";
import { startFaceDetection, stopFaceDetection } from "./media/faceDetection.js";
import { startGazeDetection, stopGazeDetection } from "./media/gazeDetection.js";
import { startAudioDetection, stopAudioDetection } from "./media/audioDetection.js";

import { getScore } from "./core/scoringEngine.js";
import { startTimer as initializeTimer, getDuration } from "./utils/timer.js";

console.log("AI Proctoring App Loaded");

let timerInterval;

async function startExamFlow() {

    try {

        // STEP 1 — Ask camera + mic permission first
        await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        // STEP 2 — Then request fullscreen
        await document.documentElement.requestFullscreen();

    } catch (err) {

        alert("Camera and microphone permission is required.");
        console.error(err);
        return;

    }

    // STEP 3 — Switch UI
    document.getElementById("pre-exam-screen").classList.add("hidden");

    const examInterface = document.getElementById("exam-interface");
    examInterface.classList.remove("hidden");
    examInterface.classList.add("flex");

    // STEP 4 — Start exam systems
    startExam();
}

async function startExam() {

    console.log("Starting Exam Systems...");

    startExamTimer();

    // Camera
    await startCamera();

    // Browser behavior detection
    setExamStarted(true);

    startTabSwitchDetection();
    startFullscreenDetection();
    startCopyPasteDetection();

    // Media based detection
    await startFaceDetection();
    startGazeDetection();
    startAudioDetection();

}

function startExamTimer() {

    initializeTimer();

    const TOTAL_DURATION = 30 * 60;

    timerInterval = setInterval(() => {

        let elapsed = getDuration();
        let duration = TOTAL_DURATION - elapsed;

        if (duration < 0) duration = 0;

        const m = Math.floor(duration / 60);
        const s = duration % 60;

        document.getElementById("timer-display").innerText =
            `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        if (duration === 0) {
            submitExam("time_up");
        }

    }, 1000);
}

function submitExam(reason = "user") {

    console.log("Exam ended:", reason);

    // Stop all trackers
    stopTabSwitchDetection();
    stopFullscreenDetection();
    stopCopyPasteDetection();

    stopFaceDetection();
    stopGazeDetection();
    stopAudioDetection();

    if (typeof stopCamera === "function") {
        stopCamera();
    }

    document.getElementById("exam-interface").classList.add("hidden");

    const endScreen = document.getElementById("end-exam-screen");
    const endTitle = document.getElementById("end-title");
    const endMessage = document.getElementById("end-message");

    if (reason === "terminated") {
        endTitle.innerText = "Exam Terminated";
        endTitle.classList.add("text-red-600");
        endMessage.innerText = "Your exam was terminated due to policy violations.";
    } else {
        endTitle.innerText = "Exam Submitted";
        endTitle.classList.remove("text-red-600");
        endMessage.innerText = "Your exam has been successfully submitted. You can exit now.";
    }

    endScreen.classList.remove("hidden");
    endScreen.classList.add("flex");

    document.getElementById("final-proctor-score").innerText = getScore();

    clearInterval(timerInterval);

}

window.submitExam = submitExam;

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("start-btn")
        .addEventListener("click", startExamFlow);

    document
        .getElementById("submit-btn")
        .addEventListener("click", () => submitExam("user"));

});