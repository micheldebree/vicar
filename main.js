/*global Image, Pixel, PixelImage, document, window, alert, NearestNeighbour, Palette */

var peptoPalette = new Palette([
    new Pixel(0, 0, 0, 0xff), // black
    new Pixel(0xff, 0xff, 0xff, 0xff), // white
    new Pixel(0x68, 0x37, 0x2b, 0xff), //red
    new Pixel(0x70, 0xa4, 0xb2, 0xff), //cyan
    new Pixel(0x6f, 0x3d, 0x86, 0xff), //purple
    new Pixel(0x58, 0x8d, 0x43, 0xff), //green
    new Pixel(0x35, 0x28, 0x79, 0xff), //blue
    new Pixel(0xb8, 0xc7, 0x6f, 0xff), //yellow
    new Pixel(0x6f, 0x4f, 0x25, 0xff), //orange
    new Pixel(0x43, 0x39, 0x00, 0xff), //brown
    new Pixel(0x9a, 0x67, 0x59, 0xff), //light red
    new Pixel(0x44, 0x44, 0x44, 0xff), //dark gray
    new Pixel(0x6c, 0x6c, 0x6c, 0xff), //medium gray
    new Pixel(0x9a, 0xd2, 0x84, 0xff), //light green
    new Pixel(0x6c, 0x5e, 0xb5, 0xff), //light blue
    new Pixel(0x95, 0x95, 0x95, 0xff) //green
]);

function grabIt(img) {
    'use strict';
    var pg = new PixelImage();
    pg.grab(img);
    var canvas = document.getElementById("Canvas0");
    canvas.width = pg.getWidth();
    canvas.height = pg.getHeight();
    var context = canvas.getContext('2d');
    context.putImageData(pg.imageData, 0, 0);
    var scaler = new NearestNeighbour();
    //pg = scaler.resize(pg, 160, 200);

    pg = scaler.resizeBounding(pg, 320, 200);
    var sW = pg.getWidth();
    pg = scaler.resize(pg, sW / 2, pg.getHeight());
    pg = peptoPalette.remap(pg);
    pg = scaler.resize(pg, sW, pg.getHeight());

    canvas.width = pg.getWidth();
    canvas.height = pg.getHeight();
    context.putImageData(pg.imageData, 0, 0);
}

window.onload = function () {
    'use strict';
    var img = new Image();
    img.src = 'images/rainbowgirl.jpg';
    img.onload = function () {
        grabIt(img);
    };
};


var c64palette = new Palette([
    new Pixel(0, 0, 0, 0xff), // black
    new Pixel(0xff, 0xff, 0xff, 0xff), // white
    new Pixel(0xab, 0x31, 0x26, 0xff), //red
    new Pixel(0x66, 0xda, 0xff, 0xff), //cyan
    new Pixel(0xbb, 0x3f, 0xb8, 0xff), //purple
    new Pixel(0x55, 0xce, 0x58, 0xff), //green
    new Pixel(0x1d, 0x0e, 0x97, 0xff), //blue
    new Pixel(0xea, 0xf5, 0x7c, 0xff), //yellow
    new Pixel(0xb9, 0x74, 0x18, 0xff), //orange
    new Pixel(0x78, 0x53, 0x00, 0xff), //brown
    new Pixel(0xdd, 0x93, 0x87, 0xff), //light red
    new Pixel(0x5b, 0x5b, 0x5b, 0xff), //dark gray
    new Pixel(0x8b, 0x8b, 0x8b, 0xff), //medium gray
    new Pixel(0xb0, 0xf4, 0xac, 0xff), //light green
    new Pixel(0xaa, 0x9d, 0xef, 0xff), //light blue
    new Pixel(0xb8, 0xb8, 0xb8, 0xff) //green
]);

