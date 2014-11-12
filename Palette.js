function Palette(pixels) {
    this.pixels = pixels;
}

Palette.prototype.map = function(pixel) {

    var i,
        d,
        minVal = null,
        minI = null;

    for (i = 0; i < this.pixels.length; i++) {
        d = pixel.getDistance(this.pixels[i]);

        if (minVal === null) {
            minVal = d;
            minI = i;
        }
        else if (d < minVal) {
            minVal = d;
            minI = i;
        }

    }

    return this.pixels[minI];

};

Palette.prototype.remap = function(pixelImage) {

    for (var y = 0; y < pixelImage.getHeight(); y++) {
        for (var x = 0; x < pixelImage.getWidth(); x++) {
            var pixel = pixelImage.peek(x, y);
            var mappedPixel = this.map(pixel);

            pixelImage.poke(x, y, mappedPixel);
            this.dither(pixelImage, x, y, pixel);


        }
    }
    return pixelImage;

};

Palette.prototype.dither = function(pixelImage, x, y, origPixel) {

    var pixel = pixelImage.peek(x, y);
    var error = origPixel.getDifference(pixel);
   
    this.addError(pixelImage, x + 1, y, error);
   
};

Palette.prototype.addError = function(pixelImage, x, y, error) {

    if (x < pixelImage.getWidth() && y < pixelImage.getHeight()) {
        var nextPixel = pixelImage.peek(x, y);
        nextPixel.addSafe(error);
        pixelImage.poke(x, y, nextPixel);
    }
};

Palette.prototype.fsdither = function(pixelImage, x, y, origPixel) {

    var pixel = pixelImage.peek(x, y);
    var error = origPixel.getDifference(pixel);

    if (x < pixelImage.getWidth() - 1) {

    }


};