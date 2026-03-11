import { logViolation } from "../core/violationLogger.js";

let audioRunning = false;
let audioContext;
let audioStream;
let audioInterval;

export async function startAudioDetection() {
    if (audioRunning) return;
    audioRunning = true;
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(audioStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        let voiceFrames = 0;
        let smoothedVolume = 0;

        const THRESHOLD = 0.04;
        const TRIGGER_FRAMES = 3; // 3 seconds at 1000ms interval

        function detect() {
            if (!audioRunning) return;

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }
            analyser.getByteTimeDomainData(data);
            let sum = 0;

            for (let i = 0; i < data.length; i++) {

                let val = (data[i] - 128) / 128;
                sum += val * val;

            }
            const volume = Math.sqrt(sum / data.length);
            smoothedVolume = smoothedVolume * 0.85 + volume * 0.15;

            if (smoothedVolume > THRESHOLD) {
                voiceFrames++;

            } else {
                voiceFrames = Math.max(0, voiceFrames - 1);
            }

            if (voiceFrames > TRIGGER_FRAMES) {
                logViolation(
                    "Background Voice Detected - Someone speaking nearby",
                    2
                );
                voiceFrames = 0;
            }
        }
        audioInterval = setInterval(detect, 1000);
        console.log("Audio detection started");

    } catch (err) {
        console.error("Audio detection failed:", err);
        logViolation(
            "Microphone Access Failed",
            1
        );
    }
}

export function stopAudioDetection() {
    audioRunning = false;
    if (audioInterval) {
        clearInterval(audioInterval);
    }
    if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
    }
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
}