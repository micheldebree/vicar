/** A pixel, consisting of red, green, blue and alpha values */
function Pixel(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

/** Adds another pixel's value but caps resulting value between 0 and 255 */
Pixel.prototype.addSafe = function(pixel) {
    this.r = Math.max(0, Math.min(this.r + pixel.r, 0xff));
    this.g = Math.max(0, Math.min(this.g + pixel.g, 0xff));
    this.b = Math.max(0, Math.min(this.b + pixel.b, 0xff));
    this.a = Math.max(0, Math.min(this.a + pixel.a, 0xff));
};

Pixel.prototype.multiply = function(factor) {
    this.r *= factor;
    this.g *= factor;
    this.b *= factor;
    this.a *= factor;
};

Pixel.prototype.divide = function(factor) {
    this.r /= factor;
    this.g /= factor;
    this.b /= factor;
    this.a /= factor;
};

Pixel.prototype.normalize = function() {
     this.r = Math.max(0, Math.min(Math.round(this.r), 0xff));
     this.g = Math.max(0, Math.min(Math.round(this.g), 0xff));
     this.b = Math.max(0, Math.min(Math.round(this.b), 0xff));
     this.a = Math.max(0, Math.min(Math.round(this.a), 0xff));
};

Pixel.prototype.getDifference = function(pixel) {
    return new Pixel(
        this.r - pixel.r,
        this.g - pixel.g,
        this.b - pixel.b,
        this.a - pixel.a
    );
};

Pixel.prototype.invert = function() {
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;
    return this;
};

/** Calculate the euclidian distantance between this pixel's color and another's */
Pixel.prototype.getDistance = function(pixel) {
    var r2 = Math.pow(this.r - pixel.r, 2),
        g2 = Math.pow(this.g - pixel.g, 2),
        b2 = Math.pow(this.b - pixel.b, 2);

    return Math.sqrt(r2 + g2 + b2);

};
