/*jslint plusplus:true*/
function Palette(pixels) {
    'use strict';
    this.pixels = pixels;
}

/** Map a pixel to the nearest pixel in this palet */
Palette.prototype.map = function (pixel) {
    'use strict';
    var i = this.pixels.length,
        d,
        minVal,
        minI = 0;

    while (i-- > 0) {
        d = pixel.getDistance(this.pixels[i]);

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
    while (i-- > 0) {
        if (pixel.equals(this.pixels[i])) {
            return i;
        }
    }
    return undefined;
};

/**
 * Add a pixel value to the pallette. If it already exists, increase its weight.
 */
Palette.prototype.add = function (pixel) {
    'use strict';
    var found = false,
        i = this.pixels.length;

    while (i-- > 0) {
        if (this.pixels[i].equals(this.pixel)) {
            this.pixels[i].w++;
        }
    }
    if (!found) {
        this.pixels.push(pixel);
    }

};

/**
 * Extract the pixel values for this palette from an area of an image.
 */
Palette.prototype.extract = function (pixelImage, x, y, w, h) {
    'use strict';

    var xi,
        yi;

    x = typeof x !== 'undefined' ? x : 0;
    y = typeof y !== 'undefined' ? y : 0;
    w = typeof w !== 'undefined' ? w : pixelImage.getWidth() - x;
    h = typeof h !== 'undefined' ? h : pixelImage.getHeight() - y;

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
        mappedPixel;

    x = typeof x !== 'undefined' ? x : 0;
    y = typeof y !== 'undefined' ? y : 0;
    w = typeof w !== 'undefined' ? w : pixelImage.getWidth() - x;
    h = typeof h !== 'undefined' ? h : pixelImage.getHeight() - y;

    for (yi = y; yi < y + h; yi++) {
        for (xi = x; xi < x + w; xi++) {
            pixel = pixelImage.peek(xi, yi);
            mappedPixel = this.map(pixel);
            pixelImage.poke(xi, yi, mappedPixel);
            this.jjnDither(pixelImage, xi, yi, pixel);
        }
    }
    return pixelImage;

};

/** Add an 'error' pixel to the pixel at x,y in pixelImage */
Palette.prototype.addError = function (pixelImage, x, y, error) {
    'use strict';
    if (x < pixelImage.getWidth() && y < pixelImage.getHeight()) {
        var nextPixel = pixelImage.peek(x, y);
        nextPixel.add(error);
        pixelImage.poke(x, y, nextPixel);
    }
};

/** Use floyd-steinberg dithering after mapping a pixel */
Palette.prototype.fsDither = function (pixelImage, x, y, origPixel) {
    'use strict';
    var pixel = pixelImage.peek(x, y),
        error = origPixel.substract(pixel);

    this.addError(pixelImage, x + 1, y, error.clone().multiply(7).divide(16));
    this.addError(pixelImage, x - 1, y + 1, error.clone().multiply(3).divide(16));
    this.addError(pixelImage, x, y + 1, error.clone().multiply(5).divide(16));
    this.addError(pixelImage, x + 1, y + 1, error.clone().divide(16));

};

/** Use michel dithering after mapping a pixel */
Palette.prototype.michelDither = function (pixelImage, x, y, origPixel) {
    'use strict';
    var pixel = pixelImage.peek(x, y),
        error = origPixel.substract(pixel);

    this.addError(pixelImage, x, y + 1, error.clone().multiply(1).divide(4));
    this.addError(pixelImage, x + 1, y, error.clone().multiply(2).divide(4));
    this.addError(pixelImage, x + 1, y + 1, error.clone().multiply(1).divide(4));

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