/*global document, PixelCalculator, ColorMap */
/*exported PixelImage*/
/*jslint bitwise: true*/
/** Create an image with access to individual pixels */
function PixelImage(imageData) {
 
    'use strict';
   
    var img,
        callback,
        resizeW,
        width,
        height,
        pixelIndex = [],
        colorMaps = [];
        
    function init(w, h) {
        var x,
            y;
      
        height = h;
        width = w;
        colorMaps = [ new ColorMap(w, h, w, h) ];
        
        // fill pixelIndex with zeroes (reference to colormap 0);
        for (y = 0; y < h; y += 1) {
            for (x = 0; x < w; x += 1) {
                if (pixelIndex[y] === undefined) {
                    pixelIndex[y] = [];
                }
                pixelIndex[y][x] = 0;
            }
        }
    }
    
    function fromImageData(imageData) {
        
        init(imageData.width, imageData.height);
        
        var colorMap = new ColorMap(1, 1);
        
        // create a 1x1 colormap from the image data
        colorMap.fromImageData(imageData);
        colorMaps = [ colorMap ];
        width = imageData.width;
        height = imageData.height;
        
        
    }
    
    
    
    function grabData() {
        var w = typeof resizeW !== 'undefined' ? resizeW : img.width,
            h = resizeW * img.height / img.width,
            imageData = PixelCalculator.getImageData(img, w, h);
        
        fromImageData(imageData);

        // call the callback event because the image data is ready
        if (typeof callback === 'function') {
            callback();
        }
    }
  
    /**
        Grab image data from an image. Grabbing is defered until the image is loaded.
        @param {Image} imgParam - The image from which to grab the data.
        @param {Function} successCallback - Handler executed after data has been grabbed.
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
        return pixelIndex !== undefined;
    }
    
    /** 
     * Get the value of a particular pixel.
     * @returns {Array} Pixel values [r, g, b, a], or an empty pixel if x and y are out of range.
     */
    function peek(x, y) {
        
        if (x >= 0 && x < width && y >= 0 && y < height) {
            var ci = pixelIndex[y][x];
            return colorMaps[ci].getColor(x, y);
        }
        return PixelCalculator.emptyPixel;
    }
    
    /** 
     * Set the value for a particular pixel. 
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array] pixel - Pixel values [r, g, b, a]
     */
    function poke(x, y, pixel) {
        
        // check if a colorMap already has this color
        var i,
            mapPixel,
            newMap;
        for (i = 0; i < colorMaps.length; i += 1) {
            mapPixel = colorMaps[i].getColor(x, y);
            if (!PixelCalculator.isEmpty(mapPixel) && PixelCalculator.equals(pixel,  mapPixel)) {
                pixelIndex[y][x] = i;
                return;
            }
        }
        
        // if not, create a new single color map
        newMap = new ColorMap(width, height, width, height);
        newMap.setColor(pixel);
        colorMaps.push(newMap);
        pixelIndex[y][x] = colorMaps.length - 1;
        
        
    }
    
    /** 
        Create a URL that can be used as the src for an Image.
        If there is no image data (yet), the URL for a default image is returned.
    */
    function toSrcUrl() {

        if (isReady()) {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                imageData,
                x,
                y;
            
            canvas.width = width;
            canvas.height = height;
            imageData = context.createImageData(width, height);
            
            for (x = 0; x < width; x += 1) {
                for (y = 0; y < height; y += 1) {
                    PixelCalculator.poke(imageData, x, y, peek(x, y));
                }
            }
            
            context.putImageData(imageData, 0, 0);
            return canvas.toDataURL();
        } else {
            return 'images/spiffygif_30x30.gif';
        }
        
    }
    
    /**
     * Subtract another PixelImage:
     * All the pixels that have the same color value in both images, will be
     * made transparent in this image.
     */
    function subtract(pixelImage) {
        var x,
            y,
            thisPixel,
            otherPixel;
        for (y = 0; y < pixelImage.getHeight(); y += 1) {
            for (x = 0; x < pixelImage.getWidth(); x += 1) {
                thisPixel = peek(x, y);
                otherPixel = pixelImage.peek(x, y);
                if (!PixelCalculator.isEmpty(otherPixel) && PixelCalculator.equals(thisPixel, otherPixel)) {
                    poke(x, y, PixelCalculator.emptyPixel);
                }
            }
        }
    }
    
    /**
     * Add another PixelImage:
     * All the pixels that are transparent in this image will be replaced.
     * with corresponding pixels from the other image.
     */
    function add(pixelImage) {
        var x,
            y;
        
        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                if (PixelCalculator.isEmpty(peek(x, y))) {
                    poke(x, y, pixelImage.peek(x, y));
                }
            }
        }
    }
    
    /**
     * Clone this PixelImage
     */
    function clone() {
        return new PixelImage(PixelCalculator.cloneImageData(imageData));
    }
    
    if (imageData !== undefined) {
        fromImageData(imageData);
    }
    
    function getWidth() {
        return width;
    }
    
    function getHeight() {
        return height;
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
        add: add,
        clone: clone
    };
    
}