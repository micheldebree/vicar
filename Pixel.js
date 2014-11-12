/*global document*/
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

