/*global document*/
function Pixel(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

Pixel.prototype.add = function (pixel) {
    this.r += pixel.r;
    this.g += pixel.g;
    this.b += pixel.b;
    this.a += pixel.a;
};

Pixel.prototype.divide = function (number) {
    this.r /= number;
    this.g /= number;
    this.b /= number;
    this.a /= number;
};

Pixel.prototype.invert = function () {
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;
    return this;
};

/** Create an image with access to individual pixels */
function PixelImage(img) {

    var canvas = document.createElement("canvas"),
        context;

    canvas.width = img.width;
    canvas.height = img.height;
    context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    this.imageData = context.getImageData(0, 0, img.width, img.height);

}

PixelImage.prototype.getWidth = function () {
    return this.imageData.width;
};

PixelImage.prototype.getHeight = function () {
    return this.imageData.height;
};

PixelImage.prototype.peek = function (x, y) {
    var i = this.coordsToindex(x ,y);
    return new Pixel(this.imageData.data[i], this.imageData.data[i + 1], this.imageData.data[i + 2], this.imageData.data[i + 3]);
};

PixelImage.prototype.poke = function (x, y, pixel) {
    var i = this.coordsToindex(x ,y);
    this.imageData.data[i] = pixel.r;
    this.imageData.data[i + 1] = pixel.g;
    this.imageData.data[i + 2] = pixel.b;
    this.imageData.data[i + 3] = pixel.a;
};

PixelImage.prototype.coordsToindex = function(x, y) {
    return y * this.getWidth() * 4 + x * 4;
};