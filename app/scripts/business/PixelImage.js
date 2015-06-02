/*global document, PixelCalculator, ColorMap, Palette */
/*exported PixelImage*/
/*jslint bitwise: true*/
/** Create an image with access to individual pixels 
    
    Pixels are indexed:
    - index 0 = transparant
    - index > 0 = color is stored in color map with that index (-1, as actual array starts at 0)

*/
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
        colorMaps = [], // maps x,y to a color
        dither = [[0]]; // an n x n matrix used for ordered dithering
    
    
    dither = [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]];
    
    
    dither = [
        [1, 49, 13, 61, 4, 52, 16, 64],
        [33, 17, 45, 29, 36, 20, 48, 31],
        [9, 57, 5, 53, 12, 60, 8, 56],
        [41, 25, 37, 21, 44, 28, 40, 24],
        [3, 51, 15, 63, 2, 50, 14, 62],
        [35, 19, 47, 31, 34, 18, 46, 30],
        [11, 59, 7, 55, 10, 58, 6, 54],
        [43, 27, 39, 23, 42, 26, 38, 22]];
    
    function init(w, h, colorMap) {
        height = h;
        width = w;
        if (colorMap !== undefined) {
            colorMaps.push(colorMap);
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
                return i + 1;
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
                return i + 1;
            }
        }
    }
    
    /**
     * Map a pixel to the closest available color at x, y
     */
    function map(pixel, x, y) {
   
        var i,
            d,
            minVal,
            minI = 0,
            other,
            ox = x % dither.length,
            oy = y % dither.length,
            offset = dither[oy][ox];
        
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
       
        return minI + 1;

    }
    
    function isInRange(x, y) {
        return x < width && y < height && x >= 0 && y >= 0;
    }
    
    function setPixelIndex(x, y, index) {
        if (isInRange(x, y)) {
            if (pixelIndex[y] === undefined) {
                pixelIndex[y] = [];
            }
            pixelIndex[y][x] = index;
        }
    }
    
    function getPixelIndex(x, y) {
        if (isInRange(x, y)) {
            if (pixelIndex[y] !== undefined) {
                return pixelIndex[y][x];
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    
    /** 
     * Set the value for a particular pixel. 
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array] pixel - Pixel values [r, g, b, a]
     */
    function poke(x, y, pixel, forceMap) {
        
        // check if a colorMap already has this color
        var newMap,
            reUseColorMap;
           
        // try to reuse existing color
        reUseColorMap = findColorMap(x, y, pixel);
        if (reUseColorMap === undefined) {
            // otherwise, claim an empty color
            if (forceMap === undefined) {
                reUseColorMap = findEmptyColor(x, y);
                if (reUseColorMap !== undefined) {
                    colorMaps[reUseColorMap - 1].add(x, y, pixel);
                }
            }
             // if all else fails, map to closest existing color
            if (reUseColorMap === undefined) {
                reUseColorMap = map(pixel, x, y, 0);
            }
        }
        
        setPixelIndex(x, y, reUseColorMap);
        
    }
    
    function drawImageData(imageData, forceMap) {
        var x,
            y,
            pixel;
        
        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                
                pixel = PixelCalculator.peek(imageData, x * pwidth, y * pheight);
                poke(x, y, pixel, forceMap);
            }
        }
    }
    
    function fromImageData(imageData) {
        
        init(imageData.width / pwidth, imageData.height / pheight);
        
        var colorMap = new ColorMap(width, height, 1, 1);
      
        colorMaps = [ colorMap ];
      
        drawImageData(imageData);
        
    }

    function reduceToMax(x, y, w, h) {
        
        var weights = [],
            ix,
            iy,
            idx,
            maxWeight,
            maxIndex;
        
        x = x !== undefined ? x : 0;
        y = y !== undefined ? y : 0;
        w = w !== undefined ? w : width;
        h = h !== undefined ? h : height;
        
        for (ix = x; ix < x + w; ix += 1) {
            for (iy = y; iy < y + h; iy += 1) {
                idx = getPixelIndex(ix, iy);
                if (idx > 0) {
                    if (weights[idx] === undefined) {
                        weights[idx] = 1;
                    } else {
                        weights[idx] = weights[idx] + 1;
                    }

                    if (maxWeight === undefined || weights[idx] > maxWeight) {
                        maxWeight = weights[idx];
                        maxIndex = idx;
                    }
                }
            }
        }
        
        return maxIndex;
        
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
            var ci = getPixelIndex(x, y);
            if (ci > 0) {
                return colorMaps[ci - 1].getColor(x, y);
            } else {
                return PixelCalculator.emptyPixel;
            }
        }
        return PixelCalculator.emptyPixel;
    }
    
    /**
     Get the color that is used the most in a certain area of the image.
    */
    function extractColor(x, y, w, h) {
        
        var ix,
            iy,
            palette;
        
        x = x !== undefined ? x : 0;
        y = y !== undefined ? y : 0;
        w = w !== undefined ? w : width;
        h = h !== undefined ? h : height;
        
        palette = new Palette();
        for (ix = x; ix < x + w; ix += 1) {
            for (iy = y; iy < y + h; iy += 1) {
                palette.add(peek(ix, iy));
            }
        }
        
        return palette.getMaxColor(); // undefined if all pixels empty
        
    }
    
    /**
        Extract an image with a single color map
    */
    function extractColorMap(colorMap) {
        
        var x,
            y,
            xx,
            yy,
            rx = colorMap.getAreaWidth(),
            ry = colorMap.getAreaHeight(),
            color,
            pixel;
        
        for (x = 0; x < width; x += rx) {
            for (y = 0; y < height; y += ry) {
                // find the maximum used color map in this area
                color = extractColor(x, y, rx, ry);
                
                if (color !== undefined) {
                
                    colorMap.add(x, y, color);
                
                    for (xx = x; xx < x + rx; xx += 1) {
                        for (yy = y; yy < y + ry; yy += 1) {
                            
                            pixel = peek(xx, yy);
                            if (PixelCalculator.equals(pixel, color)) {
                                setPixelIndex(xx, yy, 0);
                                
                            }
                        }
                    }
                }
                
            }
        }
        
        return colorMap;
        
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
            
            for (x = 0; x < width; x += 1) {
                for (y = 0; y < height; y += 1) {
                    
                    pixel = peek(x, y);
                    for (px = 0; px < pwidth; px += 1) {
                        for (py = 0; py < pheight; py += 1) {
                            PixelCalculator.poke(imageData, x * pwidth + px, y * pheight + py, pixel);
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
    
    function getPixelWidth() {
        return pwidth;
    }
    
    function getPixelHeight() {
        return pheight;
    }
    
    function addColorMap(colorMap) {
        colorMaps.push(colorMap);
    }
    
    function addAvailableColor(color) {
        var newColor = new ColorMap(width, height);
        color[3] = 0xff;
        newColor.fillWithColor(color);
        addColorMap(newColor);
        
    }
    
    function setPixelAspect(width, height) {
        pwidth = width;
        pheight = height;
    }
    
    function getColorMaps() {
        return colorMaps;
    }
    
    function setDither(ditherVal) {
        dither = ditherVal;
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
        setPixelAspect: setPixelAspect,
        getPixelWidth: getPixelWidth,
        getPixelHeight: getPixelHeight,
        extractColorMap: extractColorMap,
        getPixelIndex: getPixelIndex,
        setPixelIndex: setPixelIndex,
        addColorMap: addColorMap,
        getColorMaps: getColorMaps,
        drawImageData: drawImageData,
        setDither: setDither
        
    };
    
}