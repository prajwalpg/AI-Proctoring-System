import { logViolation } from "../core/violationLogger.js";
import { CONFIG } from "../config.js";

let pasteHandler, copyHandler, cutHandler, keydownHandler;

export function startCopyPasteDetection() {
    pasteHandler = () => {
        logViolation("Paste Attempt Detected", CONFIG.SEVERITY.HIGH);
    };

    copyHandler = () => {
        logViolation("Copy Attempt Detected", CONFIG.SEVERITY.MEDIUM);
    };

    cutHandler = () => {
        logViolation("Cut Attempt Detected", CONFIG.SEVERITY.MEDIUM);
    };

    keydownHandler = (e) => {
        const key = e.key.toLowerCase();

        if ((e.ctrlKey || e.metaKey) && (key === "c" || key === "v" || key === "x")) {
            logViolation("Copy/Paste Keyboard Shortcut", CONFIG.SEVERITY.MEDIUM);
        }
    };

    // Detect paste event
    document.addEventListener("paste", pasteHandler);

    // Detect copy event
    document.addEventListener("copy", copyHandler);

    // Detect cut event
    document.addEventListener("cut", cutHandler);

    // Detect keyboard shortcuts
    document.addEventListener("keydown", keydownHandler);
}

export function stopCopyPasteDetection() {
    if (pasteHandler) document.removeEventListener("paste", pasteHandler);
    if (copyHandler) document.removeEventListener("copy", copyHandler);
    if (cutHandler) document.removeEventListener("cut", cutHandler);
    if (keydownHandler) document.removeEventListener("keydown", keydownHandler);
}