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
        grabData = function () {
            
            // draw the image on a canvas
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            
            // save the image data from the canvas
            self.imageData = context.getImageData(0, 0, img.width, img.height);
            
            // call the callback event because the image data is ready
            if (typeof callback === 'function') {
                callback();
            }
        };

   

  
    /**
        Grab image data from an image. Grabbing is defered until the image is loaded.
        @param {Image} imgParam - The image from which to grab the data.
        @param {Function} onLoadHandler - Handler executed after data has been grabbed.
    */
    this.grab = function (imgParam, successCallback) {
        
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
