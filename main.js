/*global Image, Pixel, PixelImage, document, window, alert, NearestNeighbour, Palette, PeptoPalette, C64izer */
/*jslint bitwise: true*/
window.onload = function () {
    'use strict';
    var img = new Image(),
        canvas = document.getElementById('Canvas0'),
        context = canvas.getContext('2d'),
        c64izer = new C64izer(img);
    
    img.src = 'images/hqdefault.jpg';
    
    c64izer.palette.dither = Palette.dithers.DITHER4X4;
    c64izer.onDone = function () {
        context.putImageData(c64izer.image.imageData, 0, 0);
    };
    c64izer.convert();

};
