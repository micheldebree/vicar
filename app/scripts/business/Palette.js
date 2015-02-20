/*global PixelCalculator*/
/*jslint plusplus:true*/
function Palette() {
    'use strict';
    
    // the pixels in the palette
    this.pixels = undefined;

    // ordered dithering matrix, must be square. used when mapping an image to this palette
    this.dither = Palette.dithers.NONE;
}

Palette.dithers = {};
Palette.dithers.NONE = [0];
Palette.dithers.DITHER2X2 =  [
    [1, 3],
    [4, 2]
];
Palette.dithers.DITHER4X4 = [
    [1, 9, 3, 11],
    [13, 5, 15, 7],
    [4, 12, 2, 10],
    [16, 8, 14, 6]
];
Palette.dithers.DITHER8X8 = [
    [1, 49, 13, 61, 4, 52, 16, 64],
    [33, 17, 45, 29, 36, 20, 48, 31],
    [9, 57, 5, 53, 12, 60, 8, 56],
    [41, 25, 37, 21, 44, 28, 40, 24],
    [3, 51, 15, 63, 2, 50, 14, 62],
    [35, 19, 47, 31, 34, 18, 46, 30],
    [11, 59, 7, 55, 10, 58, 6, 54],
    [43, 27, 39, 23, 42, 26, 38, 22]
];

/** Map a pixel to the nearest pixel in this palet */
Palette.prototype.map = function (pixel, offset) {
    'use strict';
    var i = this.pixels.length,
        d,
        minVal,
        minI = 0;

    offset = offset !== undefined ? offset : 0;
    while (--i >= 0) {

        d = PixelCalculator.getDistance(pixel, this.pixels[i], offset);

        if (minVal === undefined || d < minVal) {
            minVal = d;
            minI = i;
        }
    }

    return this.pixels[minI];

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

/* Map a region of pixels in an image to pixels in this palette */
Palette.prototype.remap = function (pixelImage, x, y, w, h) {
    'use strict';

    var xi,
        yi,
        pixel,
        mappedPixel,
        ox,
        oy;

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    w = w !== undefined ? w : pixelImage.getWidth() - x;
    h = h !== undefined ? h : pixelImage.getHeight() - y;

    for (yi = y; yi < y + h; yi++) {
        for (xi = x; xi < x + w; xi++) {
            pixel = pixelImage.peek(xi, yi);

            ox = xi % this.dither.length;
            oy = yi % this.dither.length;

            mappedPixel = this.map(pixel, this.dither[oy][ox]);
            pixelImage.poke(xi, yi, mappedPixel);
            //this.fsDither(pixelImage, xi, yi, pixel);
        }
    }
    return pixelImage;

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