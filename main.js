/*global Image, Pixel, PixelImage, document, window, alert, NearestNeighbour, Palette, PeptoPalette */
/*jslint bitwise: true*/
var peptoPalette = new PeptoPalette();

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

            // resize to 320x200
            pg = scaler.resizeBounding(pg, bx, by);
            
            // resize to half width
            sW = pg.getWidth();
            pg = scaler.resize(pg, sW / 2, pg.getHeight());
            
            // remap to c64 palette
            pg = peptoPalette.remap(pg);
            
            // resize to original width so we get double width pixels
            pg = scaler.resize(pg, sW, pg.getHeight());
            
            // draw result on canvas
            canvas.width = bx;
            canvas.height = by;
            context.putImageData(pg.imageData, (bx - pg.getWidth()) >> 1, (by - pg.getHeight()) >> 1);
            context.strokeStyle = 'red';
            context.rect(0, 0, bx, by);
            context.stroke();
        };
    img.src = 'images/hqdefault.jpg';
    pg.grab(img, onGrab);

};


