const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const texture = document.getElementById("texture");
const ctx = canvas.getContext("2d");

let segmentation;

// Resising the canvas to fit the full screen
function resizeCanvas() {
    canvas.Width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// The camera set up
async function setupCamera(params) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480}
    });

    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            video.play();
            resolve();
        };
    });
    
}

// The segmentation setup
function setupSegmentation() {
    
}
