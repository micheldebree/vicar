/*global document, PixelCalculator */
/*exported PixelImage*/
/*jslint bitwise: true*/
/** Create an image with access to individual pixels */
function PixelImage() {
    'use strict';
    
    // public properties
    this.imageData = undefined;
    
    // private properties/methods, only accessible by methods defined
    // in this constructor (closure)
    var self = this,
        img,
        callback,
        resizeW,
        grabData = function () {
            var w = typeof resizeW !== 'undefined' ? resizeW : img.width,
                h = resizeW * img.height / img.width;

            self.imageData = PixelCalculator.getImageData(img, w, h);
            
            // call the callback event because the image data is ready
            if (typeof callback === 'function') {
                callback();
            }
        };

  
    /**
        Grab image data from an image. Grabbing is defered until the image is loaded.
        @param {Image} imgParam - The image from which to grab the data.
        @param {Function} onLoadHandler - Handler executed after data has been grabbed.
        @param {number} [w] - Width to resize the image to.
    */
    this.grab = function (imgParam, successCallback, w) {
        
        resizeW = w;
        callback = successCallback;

        img = imgParam;

        if (!img.complete) {
            img.onload = grabData;
        } else {
            grabData();
        }
    };
    
}

/** Create an Image object */
PixelImage.prototype.toImage = function () {
    'use strict';
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        result = new Image();

    canvas.width = this.getWidth();
    canvas.height = this.getHeight();
    context.putImageData(this.imageData, 0, 0);

    result.src = canvas.toDataURL();
    return result;
        
};

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

/**
 * @returns {number} The height of the image, or 0 if image is not ready.
 */
PixelImage.prototype.getHeight = function () {
    'use strict';
    return this.isReady() ? this.imageData.height : 0;
};

/**
 * @returns {number} The width of the image, or 0 if image is not ready.
 */
PixelImage.prototype.getWidth = function () {
    'use strict';
    return this.isReady() ? this.imageData.width : 0;
};

/**
 * Convert x and y position in image to an index in the image data.
 * @returns {number} index in the imagedata for the green channel.
 */
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
    return [
        this.imageData.data[i], 
        this.imageData.data[i + 1],
        this.imageData.data[i + 2],
        this.imageData.data[i + 3]
    ];
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
        this.imageData.data[i + 3] = pixel[3];
    }
};

/** Add the values of another pixel to the pixel at x,y in pixelImage */
PixelImage.prototype.add = function (x, y, pixel) {
    'use strict';
    if (x < this.getWidth() && y < this.getHeight()) {
        this.poke(x, y, PixelCalculator.add(this.peek(x, y), pixel));
    }
};
