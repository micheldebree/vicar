/** A pixel, consisting of red, green, blue and alpha values */
function Pixel(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.w = 1;
}

Pixel.prototype.add = function(pixel) {
    this.r += pixel.r;
    this.g += pixel.g;
    this.b += pixel.b;
    this.a += pixel.a;
    this.w += pixel.w;
    return this;
};

Pixel.prototype.substract = function(pixel) {
    this.r -= pixel.r;
    this.g -= pixel.g;
    this.b -= pixel.b;
    this.a -= pixel.a;
    this.w -= pixel.w;
    return this;
};

Pixel.prototype.multiply = function(factor) {
    this.r *= factor;
    this.g *= factor;
    this.b *= factor;
    this.a *= factor;
    this.w *= factor;
    return this;
};

Pixel.prototype.divide = function(factor) {
    this.r /= factor;
    this.g /= factor;
    this.b /= factor;
    this.a /= factor;
    this.w /= factor;
    return this;
};

/** Compare pixels by color value */
Pixel.prototype.equals = function(pixel) {
    return this.r === pixel.r && this.g === pixel.g && this.b === pixel.b;
};

Pixel.prototype.clone = function() {
    return new Pixel(this.r, this.g, this.b, this.a, this.w);
};

Pixel.prototype.normalize = function() {
    this.r = Math.max(0, Math.min(Math.round(this.r), 0xff));
    this.g = Math.max(0, Math.min(Math.round(this.g), 0xff));
    this.b = Math.max(0, Math.min(Math.round(this.b), 0xff));
    this.a = Math.max(0, Math.min(Math.round(this.a), 0xff));
};

/** Calculate the euclidian distantance between this pixel's color and another's */
Pixel.prototype.getDistance = function(pixel) {
    return Math.sqrt(
        Math.pow(this.r - pixel.r, 2) + Math.pow(this.g - pixel.g, 2) + Math.pow(this.b - pixel.b, 2)
    );
};
