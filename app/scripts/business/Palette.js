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

Palette.prototype.addPixel = function(pixel) {
    'use strict';
    if (this.indexOf(pixel) === undefined) {
        this.pixels.push(pixel);
    }
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

/** Add an 'error' pixel to the pixel at x,y in pixelImage */
Palette.prototype.addError = function (pixelImage, x, y, error) {
    'use strict';
    if (x < pixelImage.getWidth() && y < pixelImage.getHeight()) {
        var nextPixel = pixelImage.peek(x, y),
            newPixel = PixelCalculator.add(nextPixel, error);
        pixelImage.poke(x, y, newPixel);
    }
};

/** Use floyd-steinberg dithering after mapping a pixel */
Palette.prototype.fsDither = function (pixelImage, x, y, origPixel) {
    'use strict';
    var pixel = pixelImage.peek(x, y),
        error = PixelCalculator.substract(origPixel, pixel);

    this.addError(pixelImage, x + 1, y, PixelCalculator.multiply(error, 7 / 16));
    this.addError(pixelImage, x - 1, y + 1, PixelCalculator.multiply(error, 3 / 16));
    this.addError(pixelImage, x, y + 1, PixelCalculator.multiply(error, 5 / 16));
    this.addError(pixelImage, x + 1, y + 1, PixelCalculator.multiply(error, 1 / 16));

};

Palette.prototype.jjnDither = function (pixelImage, x, y, origPixel) {
    'use strict';
    var pixel = pixelImage.peek(x, y),
        error = origPixel.substract(pixel);

    this.addError(pixelImage, x + 1, y, error.clone().multiply(7).divide(48));
    this.addError(pixelImage, x + 2, y, error.clone().multiply(5).divide(48));
    this.addError(pixelImage, x - 2, y + 1, error.clone().multiply(3).divide(48));
    this.addError(pixelImage, x - 1, y + 1, error.clone().multiply(5).divide(48));
    this.addError(pixelImage, x, y + 1, error.clone().multiply(7).divide(48));
    this.addError(pixelImage, x + 1, y + 1, error.clone().multiply(5).divide(48));
    this.addError(pixelImage, x + 2, y + 1, error.clone().multiply(3).divide(48));
    this.addError(pixelImage, x - 2, y + 2, error.clone().multiply(1).divide(48));
    this.addError(pixelImage, x - 1, y + 2, error.clone().multiply(3).divide(48));
    this.addError(pixelImage, x, y + 2, error.clone().multiply(5).divide(48));
    this.addError(pixelImage, x + 1, y + 2, error.clone().multiply(3).divide(48));
    this.addError(pixelImage, x + 2, y + 2, error.clone().multiply(1).divide(48));

};
