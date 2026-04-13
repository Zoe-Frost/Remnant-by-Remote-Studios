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

    //The scale to cover the screen
    const scale = Math.max(cw/vw, ch,vh);

    const drawWidth = vw * scale;
    const drawHeight = vh * scale;

    const offsetX = (cw - drawWidth) / 2;
    const offsetY = (ch - drawHeight) / 2;

    ctx.clearRect(0,0,cw,ch);

    // The mirrored camera
    ctx.save();
    ctx.scale(-1,1);
    ctx.drawImage(
        results.image,
        -(drawWidth + offsetX),
        offsetY,
        drawWidth,
        drawHeight
    );

    ctx.restore();

    //Applying the segmentation mask
    ctx.save();
    ctx.scale(-1,1);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(
        results.segmentationMask,
        -(drawWidth + offsetX),
        offsetY,
        drawWidth,
        drawHeight
    );
    ctx.restore();

    //Filling the body with the small shapes aka, texture
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(texture,0,0,cw,ch);
    //Resetting it
    ctx.globalCompositeOperation = "source-over";
}

//Looping the program
async function render(params) {
    await segmentation.send({ image: video});
    requestAnimationFrame(render);
    
}

//Starting the program
async function start(params) {
    await setupCamera();
    resizeCanvas(); 

    setupSegmentation();
    render();
}

start()