/*global document*/
function Pixel(r,g,b,a) {
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

/** Create an image with access to individual pixels */
function PixelImage (img) {

    var canvas = document.createElement("canvas"),
        context,
        pixels = [],
        pi = 0,
        i;

    canvas.width = img.width;
    canvas.height = img.height;
    context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    this.widht = img.width;
    this.height = img.height;
    this.imageData = context.getImageData(0,0,img.width, img.height);
    
}

PixelImage.prototype.peek = function(x, y) {
    var i = y * this.width<<2 + x<<2;
    return new Pixel(this.imageData[i], this.imageData[i+1], this.imageData[i+2], this.imageData[i+3]);
};

PixelImage.prototype.poke = function(x, y, pixel) {
    var i = y * this.width<<2 + x<<2;
    this.imageData[i] = pixel.r;
    this.imageData[i+1] = pixel.g;
    this.imageData[i+2] = pixel.b;
    this.imageData[i+3] = pixel.a;
};

