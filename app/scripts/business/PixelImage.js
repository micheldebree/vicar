/*global document, PixelCalculator, ColorMap */
/*exported PixelImage*/
/*jslint bitwise: true*/
/** Create an image with access to individual pixels */
function PixelImage() {
 
    'use strict';
   
    var img, // the source for grabbing image data
        callback, // callback after grabbing image data
        resizeW, // resize width when grabbing data
        width, // width in pixels
        height, // height in pixels
        pwidth = 1, // aspect width of one pixel
        pheight = 1, // aspect height of one pixel
        pixelIndex = [], // maps pixel x,y to a colormap
        colorMaps = []; // maps x,y to a color
        
    function init(w, h) {
        var x,
            y;
      
        height = h;
        width = w;
        
        // transparent color map
        colorMaps = [ new ColorMap(w, h) ];
        
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
    
    /**
     * Find an existing color map that has a specific color at x,y
     */
    function findColorMap(x, y, color) {
        var i,
            mapColor;
        for (i = 0; i < colorMaps.length; i += 1) {
            mapColor = colorMaps[i].getColor(x, y);
            if (!PixelCalculator.isEmpty(mapColor) && PixelCalculator.equals(color,  mapColor)) {
                return i;
            }
        }
    }
    
    /**
     * Find an existing color map that has no color at x,y
     */
    function findEmptyColor(x, y) {
        var i,
            mapColor;
        for (i = 0; i < colorMaps.length; i += 1) {
            mapColor = colorMaps[i].getColor(x, y);
            if (PixelCalculator.isEmpty(mapColor)) {
                return i;
            }
        }
    }
    
    function map(pixel, x, y, offset) {
   
        var i,
            d,
            minVal,
            minI = 0,
            other;

        offset = offset !== undefined ? offset : 0;

        // determine closest pixel in palette (ignoring alpha)
        for (i = 0; i < colorMaps.length; i += 1) {
            other = colorMaps[i].getColor(x, y);

            if (!PixelCalculator.isEmpty(other)) {
                // calculate distance
                d = Math.sqrt(
                    Math.pow(pixel[0] - other[0] - offset, 2) +
                        Math.pow(pixel[1] - other[1] - offset, 2) +
                        Math.pow(pixel[2] - other[2] - offset, 2)
                );

                if (minVal === undefined || d < minVal) {
                    minVal = d;
                    minI = i;
                }
            }
        }
       
        return minI;

    }
    
    /** 
     * Set the value for a particular pixel. 
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array] pixel - Pixel values [r, g, b, a]
     */
    function poke(x, y, pixel, force) {
        
        // check if a colorMap already has this color
        var newMap,
            reUseColorMap;
           
        // try to reuse existing color
        reUseColorMap = findColorMap(x, y, pixel);
        if (reUseColorMap !== undefined) {
            pixelIndex[y][x] = reUseColorMap;
            return;
        }
       
        // try to claim empty pixel in existing map
        reUseColorMap = findEmptyColor(x, y);
        if (reUseColorMap !== undefined) {
            colorMaps[reUseColorMap].add(x, y, pixel);
            pixelIndex[y][x] = reUseColorMap;
            return;
        }

        // if reuse not forced, create a new single color map
        if (!force) {
            
            //newMap = new ColorMap(width, height, width, height);
            //newMap.fillWithColor(pixel);
            //colorMaps.push(newMap);
            //pixelIndex[y][x] = colorMaps.length - 1;
        } else {
            // otherwise, map to an available color
            pixelIndex[y][x] = map(pixel, x, y, 0);
        }
        
    }
    
    function fromImageData(imageData) {
        
        init(imageData.width / pwidth, imageData.height / pheight);
        
        var colorMap = new ColorMap(width, height, 1, 1),
            x,
            y,
            pixel;
    
        colorMaps = [ colorMap ];
        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                
                pixel = PixelCalculator.peek(imageData, x * pwidth, y * pheight);
                poke(x, y, pixel);
            }
        }
        
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
        Create a URL that can be used as the src for an Image.
        If there is no image data (yet), the URL for a default image is returned.
    */
    function toSrcUrl() {

        if (isReady()) {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                imageData,
                x,
                y,
                px,
                py,
                pixel;
            
            canvas.width = width * pwidth;
            canvas.height = height * pheight;
            imageData = context.createImageData(canvas.width, canvas.height);
            
            for (x = 0; x < width; x += pwidth) {
                for (y = 0; y < height; y += pheight) {
                    
                    pixel = peek(x, y);
                    for (px = 0; px < pwidth; px += 1) {
                        for (py = 0; py < pheight; py += 1) {
                            PixelCalculator.poke(imageData, x + px, y + py,
                                                 pixel);
                        }
                    }
                }
            }
            
            context.putImageData(imageData, 0, 0);
            return canvas.toDataURL();
        } else {
            return 'images/spiffygif_30x30.gif';
        }
        
    }
    
    function getWidth() {
        return width;
    }
    
    function getHeight() {
        return height;
    }
    
    function addAvailableColor(color) {
        var newColor = new ColorMap(width, height);
        color[3] = 0xff;
        newColor.fillWithColor(color);
        colorMaps.push(newColor);
    }
    
    function setPixelAspect(width, height) {
        pwidth = width;
        pheight = height;
    }
    
    return {
        getWidth: getWidth,
        getHeight: getHeight,
        peek: peek,
        poke: poke,
        grab: grab,
        toSrcUrl: toSrcUrl,
        init: init,
        addAvailableColor: addAvailableColor,
        fromImageData: fromImageData,
        setPixelAspect: setPixelAspect
    };
    
}