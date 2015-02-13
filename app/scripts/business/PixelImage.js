/** Create an image with access to individual pixels */
/*global document, PixelCalculator */
/*jslint bitwise: true */
/*exported PixelImage*/
function PixelImage() {
    'use strict';
    
    // public properties
    this.imageData = undefined;
    
    // private properties/methods, only accessible by methods defined
    // in this constructor (closure)
    var self = this,
        img,
        onLoad,
        grabData = function () {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            self.imageData = context.getImageData(0, 0, img.width, img.height);
            if (onLoad !== undefined) {
                onLoad();
            }
        };

    /** Clone an existing image */
    this.clone = function (pixelImage) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        canvas.width = pixelImage.getWidth();
        canvas.height = pixelImage.getHeight();
        context.putImageData(pixelImage.getImageData(), 0, 0);
        this.imageData = context.getImageData(0, 0, img.width, img.height);
    };

  
    /**
        Grab image data from an image. Grabbing is defered until the image is loaded.
        @param {Image} imgParam - The image from which to grab the data.
        @param {Function} onLoadHandler - Handler executed after data has been grabbed.
    */
    this.grab = function (imgParam, onLoadHandler) {
        
        onLoad = onLoadHandler;

        img = imgParam;

        if (!img.complete) {
            img.onload = grabData;
        } else {
            grabData();
        }
    };
    
}

/** Create new empty image */
PixelImage.prototype.init = function (w, h) {
    'use strict';
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    this.imageData = context.createImageData(w, h);
};

/**
 * @returns {Boolean} Is the image ready to be used?
 */
PixelImage.prototype.isReady = function () {
    'use strict';
    return this.imageData !== undefined;
};

PixelImage.prototype.getHeight = function () {
    'use strict';
    return this.isReady() ? this.imageData.height : 0;
};

PixelImage.prototype.getWidth = function () {
    'use strict';
    return this.isReady() ? this.imageData.width : 0;
};

PixelImage.prototype.coordsToindex = function (x, y) {
    'use strict';
    var result = Math.floor(y) * (this.getWidth() << 2) + (x << 2);
    return result < this.imageData.data.length ? result : 0;
};

/** 
 * Get the value of a particular pixel.
 * @returns {Array} Pixel values [r, g, b]
 */
PixelImage.prototype.peek = function (x, y) {
    'use strict';
    var i = this.coordsToindex(x, y);
    return [this.imageData.data[i], this.imageData.data[i + 1], this.imageData.data[i + 2]];
};

/** 
 * Set the value for a particular pixel. 
 * @param {Array} Pixel values [r, g, b]
 */
PixelImage.prototype.poke = function (x, y, pixel) {
    'use strict';
    if (pixel !== undefined) {
        var i = this.coordsToindex(x, y);
        this.imageData.data[i] = pixel[0];
        this.imageData.data[i + 1] = pixel[1];
        this.imageData.data[i + 2] = pixel[2];
        this.imageData.data[i + 3] = 0xff;
    }
};

/** Add the values of another pixel to the pixel at x,y in pixelImage */
PixelImage.prototype.add = function (x, y, pixel) {
    'use strict';
    if (x < this.getWidth() && y < this.getHeight()) {
        this.poke(x, y, PixelCalculator.add(this.peek(x, y), pixel));
    }
};
