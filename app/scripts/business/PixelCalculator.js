var PixelCalculator = {};

PixelCalculator.add = function (one, other) {
    'use strict';
    return [one[0] + other[0], one[1] + other[1], one[2] + other[2], one[3] + other[3]];
};

PixelCalculator.substract = function (one, other) {
    'use strict';
    return [one[0] - other[0], one[1] - other[1], one[2] - other[2], one[3] - other[3]];
};

PixelCalculator.multiply = function (one, factor) {
    'use strict';
    return [one[0] * factor, one[1] * factor, one[2] * factor];
};

PixelCalculator.divide = function (one, factor) {
    'use strict';
    return [one[0] / factor, one[1] / factor, one[2] / factor];
};

/** Compare pixels by color value */
PixelCalculator.equals = function (one, other) {
    'use strict';
    return one[0] === other[0] && one[1] === other[1] && one[2] === other[2];
};

PixelCalculator.clone = function (one) {
    'use strict';
    return [one[0], one[1], one[2], one[3]];
};

/** Create imageData from an Image, optionally resizing it.
 * @param {Image} img - HTML5 Image object to get the image data from.
 * @param {number} [w] - Width to rescale image to.
 * @param {number} [h] - Height to rescale image to.:w
 */
PixelCalculator.getImageData = function (img, w, h) {
    'use strict';

    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    w = typeof w !== 'undefined' ? w : img.width;
    h = typeof h !== 'undefined' ? h : img.height;

    canvas.width = w;
    canvas.height = h;

    context.drawImage(img, 0, 0, w, h);

    return context.getImageData(0, 0, w, h);

};