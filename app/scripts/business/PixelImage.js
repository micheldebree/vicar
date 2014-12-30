/** Create an image with access to individual pixels */
/*global document, Pixel */
function PixelImage() {
    'use strict';
}

PixelImage.prototype.init = function (w, h) {
    'use strict';
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    this.imageData = context.createImageData(w, h);
};

PixelImage.prototype.grab = function (img) {
    'use strict';
    var canvas = document.createElement('canvas'),
        context;

    canvas.width = img.width;
    canvas.height = img.height;
    context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    this.imageData = context.getImageData(0, 0, img.width, img.height);
};

PixelImage.prototype.getWidth = function () {
    'use strict';
    return this.imageData.width;
};

PixelImage.prototype.getHeight = function () {
    'use strict';
    return this.imageData.height;
};

PixelImage.prototype.peek = function (x, y) {
    'use strict';
    var i = this.coordsToindex(x, y);
    return new Pixel(this.imageData.data[i], this.imageData.data[i + 1], this.imageData.data[i + 2], this.imageData.data[i + 3]);
};

PixelImage.prototype.poke = function (x, y, pixel) {
    'use strict';
    if (pixel !== undefined) {
        var i = this.coordsToindex(x, y);
        this.imageData.data[i] = pixel.r;
        this.imageData.data[i + 1] = pixel.g;
        this.imageData.data[i + 2] = pixel.b;
        this.imageData.data[i + 3] = pixel.a;
    }
};

PixelImage.prototype.coordsToindex = function (x, y) {
    'use strict';
    var result = ~~y * (this.getWidth() << 2) + (~~x << 2);
    return result < this.imageData.data.length ? result : 0;
};