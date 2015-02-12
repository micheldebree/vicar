/*global Image, Pixel, PixelImage, document, window, alert, NearestNeighbour, Palette */
/*jslint bitwise: true*/
var peptoPalette = new Palette([
    [0, 0, 0], // black
    [0xff, 0xff, 0xff], // white
    [0x68, 0x37, 0x2b], //red
    [0x70, 0xa4, 0xb2], //cyan
    [0x6f, 0x3d, 0x86], //purple
    [0x58, 0x8d, 0x43], //green
    [0x35, 0x28, 0x79], //blue
    [0xb8, 0xc7, 0x6f], //yellow
    [0x6f, 0x4f, 0x25], //orange
    [0x43, 0x39, 0x00], //brown
    [0x9a, 0x67, 0x59], //light red
    [0x44, 0x44, 0x44], //dark gray
    [0x6c, 0x6c, 0x6c], //medium gray
    [0x9a, 0xd2, 0x84], //light green
    [0x6c, 0x5e, 0xb5], //light blue
    [0x95, 0x95, 0x95] //green
]);

/*
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
    [1, 3],
    [4, 2]
];
*/
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
        context = canvas.getContext('2d'),

        onGrab = function () {

            var bx = 320,
                by = 200,
                sW;

            pg = scaler.resizeBounding(pg, bx, by);
            sW = pg.getWidth();
            pg = scaler.resize(pg, sW / 2, pg.getHeight());
            pg = peptoPalette.remap(pg);
            pg = scaler.resize(pg, sW, pg.getHeight());
            canvas.width = bx;
            canvas.height = by;
            context.putImageData(pg.getImageData(), (bx - pg.getWidth()) >> 1, (by - pg.getHeight()) >> 1);
            context.strokeStyle = 'red';
            context.rect(0, 0, bx, by);
            context.stroke();
        };
    img.src = 'images/hqdefault.jpg';
    pg.grab(img, onGrab);


};


