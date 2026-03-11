let stream = null;

export async function startCamera() {
    try {

        const video = document.getElementById("video");
        if (!video) {
            console.error("Video element not found");
            return null;
        }

        if (stream) {
            video.srcObject = stream;
            await video.play();
            return stream;
        }

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 640,
                height: 480,
                facingMode: "user"
            },
            audio: true
        });

        video.srcObject = stream;
        await video.play();
        console.log("Camera started successfully");
        return stream;

    } catch (error) {

        console.error("Camera access denied or error:", error);
        alert("Camera/Microphone permission required for exam.");
        throw error;
    }
}


export function getCameraStream() {
    return stream;
}

export function stopCamera() {

    if (!stream) return;
    stream.getTracks().forEach(track => track.stop());
    stream = null;

    console.log("Camera stopped");
}