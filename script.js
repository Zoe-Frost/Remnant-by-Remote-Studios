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
    segmentation = new SelfieSegmentation({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}` // this is the file for the segmentation software//

    });

    segmentation.setOptions({
        modelSelection: 1
    });

    segmentation.onResults(onResults);
}

//Drawing everything - the fullscreen, mirror, and texture
function onResults(results) {

    const cw = canvas.width;
    const ch = canvas.height;

    const vw = results.image.width;
    const vh = results.image.height;

    //the scale to cover the screen
    const scale = Math.max(cw/vw, ch,vh);

    const drawWidth = vw * scale;
    const drawHeight = vh * scale;

    const offsetX = (cw - drawWidth) / 2;
    const offsetY = ()

}