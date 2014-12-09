function Palette(pixels) {
    this.pixels = pixels;
}

/** Map a pixel to the nearest pixel in this palet */
Palette.prototype.map = function (pixel) {

    var i,
        d,
        minVal,
        minI = 0;

    for (i = 0; i < this.pixels.length; i++) {
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
    for (var i = 0; i < this.pixels.length; i++) {
        if (pixel.equals(this.pixels[i])) {
            return i;
        }
    }
    return undefined;
};

/* Map all pixels in an image to pixels in this palette */
Palette.prototype.remap = function (pixelImage, x, y, w, h) {

    if (x === undefined) {
        x = 0;
    }
    if (y === undefined) {
        y = 0;
    }
    if (w === undefined) {
        w = pixelImage.getWidth() - x;
    }
    if (h === undefined) {
        h = pixelImage.getHeight() - y;
    }

    for (var yi = y; yi < y + h; yi++) {
        for (var xi = x; xi < x + w; xi++) {
            var pixel = pixelImage.peek(xi, yi),
                mappedPixel = this.map(pixel);

            pixelImage.poke(xi, yi, mappedPixel);
            this.fsDither(pixelImage, xi, yi, pixel);
        }
    }
    return pixelImage;

};

/** Add an 'error' pixel to the pixel at x,y in pixelImage */
Palette.prototype.addError = function (pixelImage, x, y, error) {

    if (x < pixelImage.getWidth() && y < pixelImage.getHeight()) {
        var nextPixel = pixelImage.peek(x, y);
        nextPixel.add(error);
        pixelImage.poke(x, y, nextPixel);
    }
};

/** Use floyd-steinberg dithering after mapping a pixel */
Palette.prototype.fsDither = function (pixelImage, x, y, origPixel) {

    var pixel = pixelImage.peek(x, y),
        error = origPixel.substract(pixel);

    this.addError(pixelImage, x + 1, y, error.clone().multiply(7).divide(16));
    this.addError(pixelImage, x - 1, y + 1, error.clone().multiply(3).divide(16));
    this.addError(pixelImage, x, y + 1, error.clone().multiply(5).divide(16));
    this.addError(pixelImage, x + 1, y + 1, error.clone().divide(16));

};

Palette.prototype.jjnDither = function (pixelImage, x, y, origPixel) {

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