import { addScore, getScore } from "./scoringEngine.js";
import { CONFIG } from "../config.js";

let logs = [];
let violationCooldowns = new Map();

export function logViolation(message, severity = 1) {

    const now = Date.now();

    // Prevent duplicate spam within 2 seconds
    const lastTime = violationCooldowns.get(message) || 0;
    if (now - lastTime < 2000) {
        return;
    }

    violationCooldowns.set(message, now);

    const log = `${new Date().toLocaleTimeString()} - ${message}`;

    logs.push(log);

    console.warn("Violation:", message);

    const logsEl = document.getElementById("logs");

    if (logsEl) {
        logsEl.innerText = logs.join("\n");
        logsEl.scrollTop = logsEl.scrollHeight;
    }

    showToast(message);

    addScore(severity);

    checkTermination();
}

function checkTermination() {

    const score = getScore();

    if (score >= CONFIG.TERMINATION_SCORE) {

        console.error("Exam Terminated: Too many violations");

        if (window.submitExam) {
            window.submitExam("terminated");
        }

    }
}

function showToast(message) {

    const container = document.getElementById("toast-container");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className =
        "toast-enter bg-red-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 font-medium text-sm";

    toast.innerHTML = `
        <div class="bg-red-500 rounded-full p-1 border border-red-400">
            ⚠
        </div>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.classList.remove("toast-enter");
        toast.classList.add("toast-exit");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3500);
}