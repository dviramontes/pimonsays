const LedMatrix = require("node-rpi-rgb-led-matrix");
const matrix = new LedMatrix(16);

matrix.fill(255, 50, 100);
matrix.setPixel(0, 0, 0, 50, 255);

setTimeout(() => {
    matrix.fill(155, 50, 100);
    matrix.setPixel(0, 0, 0, 50, 255);
}, 2000);