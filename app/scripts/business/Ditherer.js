/*global PixelImage*/
/*jslint plusplus: true*/
/** 
 * Dithers an image
 * @constructor
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
            error = originalPixel.substract(remappedPixel);

            i = this.weightMatrix.distribution.length;
            while (--i >= 0) {
                errorX = ix + this.weightMatrix.distribution[i][0];
                errorY = iy + this.weightMatrix.distribution[i][1];

                nextPixel = originalPixel.peek(errorX, errorY);
                nextPixel.add(error * this.weightMatrix.distribution[i][2] / this.weightMatrix.divisor);
                errorImage.poke(errorX, errorY, nextPixel);

            }

        }
    }
    
    return errorImage;
};