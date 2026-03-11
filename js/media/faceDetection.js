import { logViolation } from "../core/violationLogger.js";
import { CONFIG } from "../config.js";
import { processGaze } from "./gazeDetection.js";

let multipleFaceLogged = false;
let noFaceStartTime = null;
let faceInterval;
let detectionCanvas;

const NO_FACE_THRESHOLD = 1000; // 1 second

export async function startFaceDetection() {

    const video = document.getElementById("video");

    console.log("Loading Face Models...");

    await faceapi.nets.ssdMobilenetv1.loadFromUri(
        "https://justadudewhohacks.github.io/face-api.js/models"
    );

    await faceapi.nets.faceLandmark68Net.loadFromUri(
        "https://justadudewhohacks.github.io/face-api.js/models"
    );

    console.log("Face Models Loaded");

    // Create detection canvas
    detectionCanvas = faceapi.createCanvasFromMedia(video);

    detectionCanvas.style.position = "absolute";
    detectionCanvas.style.top = "0";
    detectionCanvas.style.left = "0";
    detectionCanvas.style.width = "100%";
    detectionCanvas.style.height = "100%";
    detectionCanvas.style.pointerEvents = "none";

    video.parentElement.appendChild(detectionCanvas);

    const displaySize = {
        width: video.videoWidth || 640,
        height: video.videoHeight || 480
    };

    faceapi.matchDimensions(detectionCanvas, displaySize);

    // Define helper function outside the loop for efficiency
    function handleFaceAbsence(faceCount) {
        if (faceCount === 0) {
            if (!noFaceStartTime) {
                noFaceStartTime = Date.now();
            }

            if (Date.now() - noFaceStartTime > NO_FACE_THRESHOLD) {
                logViolation(
                    "Face Not Visible - Candidate Left Camera",
                    CONFIG.SEVERITY.HIGH
                );
                noFaceStartTime = Date.now();
            }
            multipleFaceLogged = false;
        } else {
            noFaceStartTime = null;
        }
    }

    faceInterval = setInterval(async () => {

        if (video.paused || video.ended) {
            // Treat paused video (e.g., camera removed) as ZERO detections instead of skipping the check
            handleFaceAbsence(0);
            return;
        }

        const detections = await faceapi
            .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks();

        if (!detectionCanvas) return;

        const resized = faceapi.resizeResults(detections, displaySize);

        const ctx = detectionCanvas.getContext("2d");
        ctx.clearRect(0, 0, detectionCanvas.width, detectionCanvas.height);

        faceapi.draw.drawDetections(detectionCanvas, resized);

        // ---------- FACE ABSENCE DETECTION ----------
        handleFaceAbsence(detections.length);

        if (detections.length > 0) {
            processGaze(detections[0]);

            // ---------- MULTI FACE DETECTION ----------
            if (detections.length >= 2) {

                if (!multipleFaceLogged) {

                    logViolation(
                        "Multiple Faces Detected - Possible Assistance",
                        CONFIG.SEVERITY.HIGH
                    );

                    multipleFaceLogged = true;
                }

            } else {

                multipleFaceLogged = false;

            }

        } else {
            processGaze(null);
        }

    }, 1200);
}

export function stopFaceDetection() {
    if (faceInterval) {
        clearInterval(faceInterval);
    }
    if (detectionCanvas) {
        detectionCanvas.remove();
        detectionCanvas = null;
    }
}