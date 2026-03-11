import { logViolation } from "../core/violationLogger.js";
import { CONFIG } from "../config.js";

let lastBlurTime = 0;
const BLUR_COOLDOWN = 2000; // 2 seconds

let blurHandler;

export function startFocusBlurDetection() {
    blurHandler = () => {
        const now = Date.now();

        // Prevent spam logging
        if (now - lastBlurTime < BLUR_COOLDOWN) return;

        lastBlurTime = now;

        logViolation(
            "Window Lost Focus - Possible App Switch",
            CONFIG.SEVERITY.MEDIUM
        );
    };

    window.addEventListener("blur", blurHandler);
}

export function stopFocusBlurDetection() {
    if (blurHandler) {
        window.removeEventListener("blur", blurHandler);
    }
}