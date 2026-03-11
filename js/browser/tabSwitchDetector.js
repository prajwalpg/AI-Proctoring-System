import { logViolation } from "../core/violationLogger.js";
import { CONFIG } from "../config.js";

let lastTriggerTime = 0;

let visibilityHandler;

export function startTabSwitchDetection() {
    visibilityHandler = () => {
        if (document.hidden) {
            const now = Date.now();

            // Prevent rapid duplicate triggers
            if (now - lastTriggerTime < 2000) return;

            lastTriggerTime = now;

            logViolation(
                "Tab Switched - Candidate moved away from exam tab",
                CONFIG.SEVERITY.MEDIUM
            );
        }
    };

    document.addEventListener("visibilitychange", visibilityHandler);
}

export function stopTabSwitchDetection() {
    if (visibilityHandler) {
        document.removeEventListener("visibilitychange", visibilityHandler);
    }
}