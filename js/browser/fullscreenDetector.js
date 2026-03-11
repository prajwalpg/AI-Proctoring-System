import { logViolation } from "../core/violationLogger.js";
import { CONFIG } from "../config.js";

let examStarted = false;
let fullscreenHandler;

export function setExamStarted(started = true) {
    examStarted = started;
}

export function startFullscreenDetection() {

    fullscreenHandler = () => {
        // Ignore before exam actually starts
        if (!examStarted) return;

        // Check cross-browser fullscreen elements
        const isFullscreen = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        if (!isFullscreen) {
            logViolation(
                "Exited Fullscreen Mode",
                CONFIG.SEVERITY.HIGH
            );

            alert("You must stay in fullscreen mode to continue.");
            showReturnFullscreenScreen();
        }
    };

    // Bind to all vendor prefixed events
    document.addEventListener("fullscreenchange", fullscreenHandler);
    document.addEventListener("webkitfullscreenchange", fullscreenHandler);
    document.addEventListener("mozfullscreenchange", fullscreenHandler);
    document.addEventListener("MSFullscreenChange", fullscreenHandler);
}

export function stopFullscreenDetection() {
    if (fullscreenHandler) {
        document.removeEventListener("fullscreenchange", fullscreenHandler);
        document.removeEventListener("webkitfullscreenchange", fullscreenHandler);
        document.removeEventListener("mozfullscreenchange", fullscreenHandler);
        document.removeEventListener("MSFullscreenChange", fullscreenHandler);
    }
}

function showReturnFullscreenScreen() {

    const returnScreen = document.getElementById("fullscreen-warning");

    if (returnScreen) {
        returnScreen.classList.remove("hidden");
        returnScreen.classList.add("flex");
    }
}

export async function returnToFullscreen() {

    try {

        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
            await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
            await docEl.webkitRequestFullscreen();
        } else if (docEl.msRequestFullscreen) {
            await docEl.msRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
            await docEl.mozRequestFullScreen();
        }

        const returnScreen = document.getElementById("fullscreen-warning");
        if (returnScreen) {
            returnScreen.classList.remove("flex");
            returnScreen.classList.add("hidden");
        }

    } catch (err) {

        console.error("Fullscreen re-entry failed", err);

    }
}