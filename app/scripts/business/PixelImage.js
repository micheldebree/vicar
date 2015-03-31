/*global document, PixelCalculator */
/*exported PixelImage*/
/*jslint bitwise: true*/
/** Create an image with access to individual pixels */
function PixelImage() {
 
    'use strict';
   
    var img,
        callback,
        resizeW,
        imageData;
        
    function grabData() {
        var w = typeof resizeW !== 'undefined' ? resizeW : img.width,
            h = resizeW * img.height / img.width;

        imageData = PixelCalculator.getImageData(img, w, h);

        // call the callback event because the image data is ready
        if (typeof callback === 'function') {
            callback();
        }
    }
  
    /**
        Grab image data from an image. Grabbing is defered until the image is loaded.
        @param {Image} imgParam - The image from which to grab the data.
        @param {Function} onLoadHandler - Handler executed after data has been grabbed.
        @param {number} [w] - Width to resize the image to.
    */
    function grab(imgParam, successCallback, w) {
        
        resizeW = w;
        callback = successCallback;

        img = imgParam;

        if (!img.complete) {
            
            // chain multiple onload functions onto the onload event
            var currentOnLoad = img.onload;
            if (typeof currentOnLoad !== 'function') {
                img.onload = grabData;
            } else {
                img.onload = function () {
                    currentOnLoad();
                    grabData();
                };
            }
        } else {
            grabData();
        }
    }
    
    /**
     * @returns {Boolean} Is the image ready to be used?
     */
    function isReady() {
        return imageData !== undefined;
    }
    
    /**
     * @returns {number} The width of the image, or 0 if image is not ready.
     */
    function getWidth() {
        return isReady() ? imageData.width : 0;
    }
    
    /**
     * @returns {number} The height of the image, or 0 if image is not ready.
     */
    function getHeight() {
        return isReady() ? imageData.height : 0;
    }
    
    /**
     * Convert x and y position in image to an index in the image data.
     * @returns {number} index in the imagedata for the green channel.
     */
    function coordsToindex(x, y) {
        var result = Math.floor(y) * (getWidth() << 2) + (x << 2);
        return result < imageData.data.length ? result : undefined;
    }
    
    /** 
     * Get the value of a particular pixel.
     * @returns {Array} Pixel values [r, g, b, a]
     */
    function peek(x, y) {
        var i = coordsToindex(x, y);
        if (typeof i !== 'undefined') {
            return [
                imageData.data[i],
                imageData.data[i + 1],
                imageData.data[i + 2],
                imageData.data[i + 3]
            ];
        } else {
            return [0, 0, 0, 0];
        }
    }
    
    /** 
     * Set the value for a particular pixel. 
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array] pixel - Pixel values [r, g, b, a]
     */
    function poke(x, y, pixel) {
        if (pixel !== undefined) {
            var i = coordsToindex(x, y);
            if (typeof i !== 'undefined') {
                imageData.data[i] = pixel[0];
                imageData.data[i + 1] = pixel[1];
                imageData.data[i + 2] = pixel[2];
                imageData.data[i + 3] = pixel[3];
            }
        }
    }
    
    /** 
        Create a URL that can be used as the src for an Image.
    */
    function toSrcUrl() {

        if (isReady()) {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');

            canvas.width = getWidth();
            canvas.height = getHeight();
            context.putImageData(imageData, 0, 0);

            return canvas.toDataURL();
        } else {
            return 'images/spiffygif_30x30.gif';
        }
        
    }
    
    function subtract(pixelImage) {
        var x,
            y,
            thisPixel,
            otherPixel;
        for (y = 0; y < pixelImage.getHeight(); y += 1) {
            for (x = 0; x < pixelImage.getWidth(); x += 1) {
                thisPixel = peek(x, y);
                otherPixel = pixelImage.peek(x, y);
                if (otherPixel[3] > 0 && PixelCalculator.equals(thisPixel, otherPixel)) {
                    poke(x, y, [0, 0, 0, 0]);
                }
            }
        }
    }
    
    function add(pixelImage) {
        var x,
            y,
            thisPixel;
        for (y = 0; y < getHeight(); y += 1) {
            for (x = 0; x < getWidth(); x += 1) {
                thisPixel = peek(x, y);
              
                if (thisPixel[3] === 0) {
                    poke(x, y, pixelImage.peek(x, y));
                }
            }
        }
    }
    
    function init(w, h) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        imageData = context.createImageData(w, h);
    }
    
    return {
        getWidth: getWidth,
        getHeight: getHeight,
        peek: peek,
        poke: poke,
        grab: grab,
        toSrcUrl: toSrcUrl,
        init: init,
        subtract: subtract,
        add: add
    };
    
}