/** A pixel, consisting of red, green, blue and alpha values */
function Pixel(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

Pixel.prototype.add = function(pixel) {
    this.r += pixel.r;
    this.g += pixel.g;
    this.b += pixel.b;
    this.a += pixel.a;
};

Pixel.prototype.divide = function(number) {
    this.r /= number;
    this.g /= number;
    this.b /= number;
    this.a /= number;
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
