var PixelCalculator = {};

PixelCalculator.add = function (one, other) {
    'use strict';
    return [one[0] + other[0], one[1] + other[1], one[2] + other[2]];
};

PixelCalculator.substract = function (one, other) {
    'use strict';
    return [one[0] - other[0], one[1] - other[1], one[2] - other[2]];
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
    return [one[0], one[1], one[2]];
};

/** Calculate the euclidian distantance between this pixel's color and another's */
PixelCalculator.getDistance = function (one, other, offset) {
    'use strict';

    offset = offset !== undefined ? offset : 0;

    return Math.sqrt(
        Math.pow(one[0] - other[0] - offset, 2) + Math.pow(one[1] - other[1] - offset, 2) + Math.pow(one[2] - other[2] - offset, 2)
    );
};



/** Create imageData from an Image, optionally resizing it */
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


