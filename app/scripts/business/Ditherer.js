/*global PixelImage, Ditherer, PixelCalculator */
/*jslint plusplus: true*/
/** 
 * Dithers an image
 * @constructor
 * NOT USED YET
*/
function Ditherer(weightMatrix) {
    'use strict';

    this.weightMatrix = weightMatrix !== undefined ? weightMatrix : {
        'divisor': 16,
        'distribution': [
            [1, 0, 7],
            [-1, 1, 3],
            [0, 1, 5],
            [1, 1, 1]
        ]
    };

}

Ditherer.prototype.dither = function (originalImage, remappedImage) {
    'use strict';

    var originalPixel,
        remappedPixel,
        nextPixel,
        error,
        iy,
        ix,
        i,
        errorX,
        errorY,
        errorImage = new PixelImage();

    errorImage.clone(originalImage);

    iy = originalImage.getHeight();
    while (--iy >= 0) {
        ix = originalImage.getWidth();
        while (--ix >= 0) {
            originalPixel = originalImage.peek(ix, iy);
            remappedPixel = remappedImage.peek(ix, iy);
            error = PixelCalculator.substract(originalPixel, remappedPixel);
            i = this.weightMatrix.distribution.length;
            while (--i >= 0) {
                errorX = ix + this.weightMatrix.distribution[i][0];
                errorY = iy + this.weightMatrix.distribution[i][1];

                nextPixel = originalImage.peek(errorX, errorY);
                nextPixel.add(error * this.weightMatrix.distribution[i][2] / this.weightMatrix.divisor);
                errorImage.poke(errorX, errorY, nextPixel);

            }

        }
    }
    
    return errorImage;
};

/** old code moved from Palette */

/** Add an 'error' pixel to the pixel at x,y in pixelImage */
Ditherer.prototype.addError = function (pixelImage, x, y, error) {
    'use strict';
    if (x < pixelImage.getWidth() && y < pixelImage.getHeight()) {
        var nextPixel = pixelImage.peek(x, y),
            newPixel = PixelCalculator.add(nextPixel, error);
        pixelImage.poke(x, y, newPixel);
    }
};

/** Use floyd-steinberg dithering after mapping a pixel */
Ditherer.prototype.fsDither = function (pixelImage, x, y, origPixel) {
    'use strict';
    var pixel = pixelImage.peek(x, y),
        error = PixelCalculator.substract(origPixel, pixel);

    this.addError(pixelImage, x + 1, y, PixelCalculator.multiply(error, 7 / 16));
    this.addError(pixelImage, x - 1, y + 1, PixelCalculator.multiply(error, 3 / 16));
    this.addError(pixelImage, x, y + 1, PixelCalculator.multiply(error, 5 / 16));
    this.addError(pixelImage, x + 1, y + 1, PixelCalculator.multiply(error, 1 / 16));

};

Ditherer.prototype.jjnDither = function (pixelImage, x, y, origPixel) {
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
