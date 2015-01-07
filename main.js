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

peptoPalette.dither = [
    [1, 49, 13, 61, 4, 52, 16, 64],
    [33, 17, 45, 29, 36, 20, 48, 31],
    [9, 57, 5, 53, 12, 60, 8, 56],
    [41, 25, 37, 21, 44, 28, 40, 24],
    [3, 51, 15, 63, 2, 50, 14, 62],
    [35, 19, 47, 31, 34, 18, 46, 30],
    [11, 59, 7, 55, 10, 58, 6, 54],
    [43, 27, 39, 23, 42, 26, 38, 22]
];

peptoPalette.dither = [
    [1, 9, 3, 11],
    [13, 5, 15, 7],
    [4, 12, 2, 10],
    [16, 8, 14, 6]
];

window.onload = function () {
    'use strict';
    var img = new Image(),
        pg = new PixelImage(),
        scaler = new NearestNeighbour(),
        canvas = document.getElementById('Canvas0'),
        context = canvas.getContext('2d');

    img.src = 'images/hqdefault.jpg';
    pg.setOnGrab(function () {

        var bx = 320;
        var by = 200;

        pg = scaler.resizeBounding(pg, bx, by);
        var sW = pg.getWidth();
        pg = scaler.resize(pg, sW / 2, pg.getHeight());
        pg = peptoPalette.remap(pg);
        pg = scaler.resize(pg, sW, pg.getHeight());
        canvas.width = bx;
        canvas.height = by;
        context.putImageData(pg.getImageData(), (bx - pg.getWidth()) >> 1, (by - pg.getHeight()) >> 1);
        context.strokeStyle='red';
        context.rect(0,0, bx, by);
        context.stroke();
    });

    pg.grab(img);


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
