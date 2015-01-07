/** A pixel, consisting of red, green, blue and alpha values */
function Pixel(r, g, b, a) {
    'use strict';
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.w = 1;
}

Pixel.prototype.add = function (pixel) {
    'use strict';
    this.r += pixel.r;
    this.g += pixel.g;
    this.b += pixel.b;
    this.a += pixel.a;
    this.w += pixel.w;
    return this;
};

Pixel.prototype.substract = function (pixel) {
    'use strict';
    this.r -= pixel.r;
    this.g -= pixel.g;
    this.b -= pixel.b;
    this.a -= pixel.a;
    this.w -= pixel.w;
    return this;
};

Pixel.prototype.multiply = function (factor) {
    'use strict';
    this.r *= factor;
    this.g *= factor;
    this.b *= factor;
    this.a *= factor;
    this.w *= factor;
    return this;
};

Pixel.prototype.divide = function (factor) {
    'use strict';
    this.r /= factor;
    this.g /= factor;
    this.b /= factor;
    this.a /= factor;
    this.w /= factor;
    return this;
};

/** Compare pixels by color value */
Pixel.prototype.equals = function (pixel) {
    'use strict';
    return this.r === pixel.r && this.g === pixel.g && this.b === pixel.b;
};

Pixel.prototype.clone = function () {
    'use strict';
    return new Pixel(this.r, this.g, this.b, this.a, this.w);
};

Pixel.prototype.normalize = function () {
    'use strict';
    this.r = Math.max(0, Math.min(Math.round(this.r), 0xff));
    this.g = Math.max(0, Math.min(Math.round(this.g), 0xff));
    this.b = Math.max(0, Math.min(Math.round(this.b), 0xff));
    this.a = Math.max(0, Math.min(Math.round(this.a), 0xff));
    this.w = 1;
};

/** Calculate the euclidian distantance between this pixel's color and another's */
Pixel.prototype.getDistance = function (pixel, offset) {
    'use strict';

    offset = offset !== undefined ? offset : 0;

    return Math.sqrt(
        Math.pow(this.r - pixel.r - offset, 2) + Math.pow(this.g - pixel.g - offset, 2) + Math.pow(this.b - pixel.b - offset, 2)
    );
};
