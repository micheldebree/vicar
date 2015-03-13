/*global PixelCalculator*/
/*jslint plusplus:true*/
/*
 * A palette is a list of different pixel values.
 * The palette can remap an arbitrary image to only use pixel values that are
 * part of the palette.
 * @constructor
 */
function Palette() {
    'use strict';
    
    // the pixels in the palette
    this.pixels = undefined;

}

/**
 * Add a pixel to the palette.
 * Doesn't add if an identical pixel is already in the palette.
 * @return {number} The index where the pixel is (added or existing) in the palette.
 */
Palette.prototype.addPixel = function (pixel) {
    'use strict';
    
    var i = this.indexOf(pixel);
    
    if (i === undefined) {
        this.pixels.push(pixel);
        i = this.pixels.length - 1;
    }

    return i;
};

/** Get the index in de palette for a pixel. undefined if the pixel is not in the palette */
Palette.prototype.indexOf = function (pixel) {
    'use strict';
    var i = this.pixels.length;
    while (--i >= 0) {
        if (PixelCalculator.equals(pixel, this.pixels[i])) {
            return i;
        }
    }
    return undefined;
};

/**
 * Extract the pixel values for this palette from an area of an image.
 */
Palette.prototype.extract = function (pixelImage, x, y, w, h) {
    'use strict';

    var xi,
        yi;

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    w = w !== undefined ? w : pixelImage.getWidth() - x;
    h = h !== undefined ? h : pixelImage.getHeight() - y;

    for (yi = y; yi < y + h; yi++) {
        for (xi = x; xi < x + w; xi++) {
            this.add(pixelImage.peek(xi, yi));
        }
    }

};

