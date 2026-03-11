import { CONFIG } from "../config.js";

let totalScore = 0;
let terminated = false;

export function addScore(points) {

    if (terminated) return;

    totalScore += points;

    console.log("Current Score:", totalScore);

    updateScoreUI();

    if (totalScore >= CONFIG.TERMINATION_SCORE) {
        terminateExam();
    }
}

function terminateExam() {

    if (terminated) return;

    terminated = true;

    console.warn("Exam Terminated Due To Suspicious Activity");

    if (window.submitExam) {
        window.submitExam("terminated");
    } else {
        alert("Exam Terminated Due To Suspicious Activity");
    }
}

function updateScoreUI() {

    const scoreEl = document.getElementById("final-proctor-score");

    if (scoreEl) {
        scoreEl.innerText = totalScore;
    }
}

export function getScore() {
    return totalScore;
}

export function isTerminated() {
    return terminated;
}