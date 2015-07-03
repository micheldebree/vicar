/*global document, PixelCalculator, ColorMap */
/*exported PixelImage*/
/*jslint bitwise: true*/
/** Create an image with access to individual pixels 
    
    Pixels are indexed:
    - index 0 = transparant
    - index > 0 = color is stored in color map with that index (-1, as actual array starts at 0)

http://csdb.dk/forums/?roomid=11&topicid=21409&showallposts=1

http://www.tannerhelland.com/4660/dithering-eleven-algorithms-source-code/

http://www.efg2.com/Lab/Library/ImageProcessing/DHALF.TXT

*/
function PixelImage() {
 
    'use strict';
   
    // public properties
    this.height = undefined;
    this.width = undefined;
    this.pWidth = 1; // aspect width of one pixel
    this.pHeight = 1; // aspect height of one pixel
    this.colorMaps = []; // maps x,y to a color
    this.palette = undefined; // the palette for all colors used in this image
    this.pixelIndex = []; // maps pixel x,y to a colormap 
    this.ditherOffset = []; // offset for dithering used when mapping color
    this.dither = [
        [1, 49, 13, 61, 4, 52, 16, 64],
        [33, 17, 45, 29, 36, 20, 48, 31],
        [9, 57, 5, 53, 12, 60, 8, 56],
        [41, 25, 37, 21, 44, 28, 40, 24],
        [3, 51, 15, 63, 2, 50, 14, 62],
        [35, 19, 47, 31, 34, 18, 46, 30],
        [11, 59, 7, 55, 10, 58, 6, 54],
        [43, 27, 39, 23, 42, 26, 38, 22]]; // 65
    
    this.dither = [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]]; // 17
    
    this.dither = [
        [3, 7, 4],
        [6, 1, 9],
        [2, 8, 5]]; // 10
    
    //this.dither = [[0]];
        
}
    
PixelImage.prototype.init = function (w, h, colorMap) {
    'use strict';
    
    this.height = h;
    this.width = w;
    if (colorMap !== undefined) {
        this.colorMaps.push(colorMap);
    }
};
    
/**
 * Find an existing color map that has a specific color at x,y, or has
 * an empty (undefined) spot available 
 */
PixelImage.prototype.findColorMap = function (x, y, color) {
    'use strict';
    
    var i,
        mapColor,
        match;
    
    for (i = 0; i < this.colorMaps.length; i += 1) {
        mapColor = this.colorMaps[i].getColor(x, y);
        if (mapColor === undefined) {
            match = i;
        }
        if (color === mapColor) {
            return i;
        }
    }

    return match;
};
    
    /**
     * Map a pixel to the closest available color at x, y
     */
PixelImage.prototype.map = function (pixel, x, y, offsetPixel) {
    'use strict';
   
    var i,
        d,
        minVal,
        minI = 0,
        other;

    // determine closest pixel in palette (ignoring alpha)
    for (i = 0; i < this.colorMaps.length; i += 1) {
        other = this.colorMaps[i].getColor(x, y);
        d = this.palette.getDistance(pixel, other, offsetPixel);
        if (minVal === undefined || d < minVal) {
            minVal = d;
            minI = i;
        }
    }

    return minI;

};
    
PixelImage.prototype.setPixelIndex = function s(x, y, index) {
    'use strict';

    if (this.pixelIndex[y] === undefined) {
        this.pixelIndex[y] = [];
    }
    this.pixelIndex[y][x] = index;
};
    
PixelImage.prototype.getPixelIndex = function (x, y) {
    'use strict';
    var row = this.pixelIndex[y];
    return row !== undefined ? row[x] : undefined;
};

PixelImage.prototype.setDitherOffset = function (x, y, offsetPixel) {
    'use strict';
    if (x < this.width && y < this.height) {
        if (this.ditherOffset[y] === undefined) {
            this.ditherOffset[y] = [];
        }
        this.ditherOffset[y][x] = offsetPixel;
    }
    
};

PixelImage.prototype.addDitherOffset = function (x, y, offsetPixel) {
    'use strict';
    var currentOffset = this.getDitherOffset(x, y);
    this.setDitherOffset(x, y, PixelCalculator.add(currentOffset, offsetPixel));
};

PixelImage.prototype.getDitherOffset = function (x, y) {
    'use strict';
    var row = this.ditherOffset[y];
    if (row !== undefined && row[x] !== undefined) {
        return row[x];
    }
    return PixelCalculator.emptyPixel;
    
};

PixelImage.prototype.weighError = function (error, mul, div) {
    'use strict';
    return [
        (error[0] * mul) / div,
        (error[1] * mul) / div,
        (error[2] * mul) / div
    ];
};

PixelImage.prototype.fsDither = function (x, y, error) {
    'use strict';
    this.addDitherOffset(x + 1, y,  this.weighError(error, 7, 16));
    this.addDitherOffset(x - 1, y + 1, this.weighError(error, 3, 16));
    this.addDitherOffset(x, y + 1, this.weighError(error, 5, 16));
    this.addDitherOffset(x + 1, y + 1, this.weighError(error, 1, 16));
};

PixelImage.prototype.jjnDither = function (x, y, error) {
    'use strict';
    this.addDitherOffset(x + 1, y,  this.weighError(error, 7, 48));
    this.addDitherOffset(x + 2, y,  this.weighError(error, 5, 48));
    this.addDitherOffset(x - 2, y + 1, this.weighError(error, 3, 48));
    this.addDitherOffset(x - 1, y + 1, this.weighError(error, 5, 48));
    this.addDitherOffset(x, y + 1, this.weighError(error, 7, 48));
    this.addDitherOffset(x + 1, y + 1, this.weighError(error, 5, 48));
    this.addDitherOffset(x + 2, y + 1, this.weighError(error, 3, 48));
    this.addDitherOffset(x - 2, y + 2, this.weighError(error, 1, 48));
    this.addDitherOffset(x - 1, y + 2, this.weighError(error, 3, 48));
    this.addDitherOffset(x, y + 2, this.weighError(error, 5, 48));
    this.addDitherOffset(x + 1, y + 2, this.weighError(error, 3, 48));
    this.addDitherOffset(x + 2, y + 2, this.weighError(error, 1, 48));
};

PixelImage.prototype.atkinsonDither = function (x, y, error) {
    'use strict';
    this.addDitherOffset(x + 1, y,  this.weighError(error, 1, 8));
    this.addDitherOffset(x + 2, y, this.weighError(error, 1, 8));
    this.addDitherOffset(x - 1, y + 1, this.weighError(error, 1, 8));
    this.addDitherOffset(x, y + 1, this.weighError(error, 1, 8));
    this.addDitherOffset(x + 1, y + 1, this.weighError(error, 1, 8));
    this.addDitherOffset(x, y + 2, this.weighError(error, 1, 8));
};

PixelImage.prototype.orderedDither = function (x, y, pixel) {
    'use strict';
    var offset = this.dither[y % this.dither.length][x % this.dither.length],
        offsetPixel;
    
    offsetPixel = PixelCalculator.multiply(pixel, -offset);
    offsetPixel = PixelCalculator.divide(offsetPixel, 10);
    
    this.addDitherOffset(x + 1, y, offsetPixel);
};


/** 
 * Set the value for a particular pixel. 
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @param {Array] pixel - Pixel values [r, g, b, a]
 */
PixelImage.prototype.poke = function (x, y, pixel) {
    'use strict';
   
    var mappedIndex,
        mappedPixel,
        colorMap,
        offsetPixel,
        error;

    offsetPixel = this.getDitherOffset(x, y);
    //this.setDitherOffset(x, y, PixelCalculator.emptyPixel);
    
    // map to closest color in palette
    mappedIndex = this.palette.mapPixel(pixel, offsetPixel);

    
    // use the error for dithering
    mappedPixel = this.palette.get(mappedIndex);
    error = PixelCalculator.substract(mappedPixel, pixel);
    
    //this.orderedDither(x, y, pixel);
    //this.fsDither(x, y, error);
    this.jjnDither(x, y, error);
    //this.atkinsonDither(x, y, error);
    
    // try to reuse existing color map 
    colorMap = this.findColorMap(x, y, mappedIndex);
    if (colorMap !== undefined) {
        this.colorMaps[colorMap].add(x, y, mappedIndex);
    } else {
         // if all else fails, map to closest existing color
        if (colorMap === undefined) {
            colorMap = this.map(pixel, x, y, offsetPixel);
        }
    }

    this.setPixelIndex(x, y, colorMap);

};
    
PixelImage.prototype.drawImageData = function (imageData) {
    'use strict';
    var x,
        y,
        pixel;

    for (y = 0; y < this.height; y += 1) {
        for (x = 0; x < this.width; x += 1) {
            pixel = PixelCalculator.peek(imageData, x, y);
            this.poke(x, y, pixel);
        }
    }
};

    
PixelImage.prototype.fromImageData = function (imageData) {
    'use strict';
    this.init(imageData.width, imageData.height);
    this.colorMaps = [ new ColorMap(this.width, this.height, 1, 1) ];
    this.drawImageData(imageData);
};

PixelImage.prototype.reduceToMax = function (x, y, w, h) {
    'use strict';
    var weights = [],
        ix,
        iy,
        idx,
        color,
        maxWeight,
        maxColor;

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    w = w !== undefined ? w : this.width;
    h = h !== undefined ? h : this.height;

    for (ix = x; ix < x + w; ix += 1) {
        for (iy = y; iy < y + h; iy += 1) {
            idx = this.getPixelIndex(ix, iy);
            if (idx !== undefined) {
                color = this.colorMaps[idx].getColor(ix, iy);
                if (weights[color] === undefined) {
                    weights[color] = 1;
                } else {
                    weights[color] = weights[color] + 1;
                }

                if (maxWeight === undefined || weights[color] > maxWeight) {
                    maxWeight = weights[color];
                    maxColor = color;
                }
            }
        }
    }

    return maxColor;

};
  
/**
 * @returns {Boolean} Is the image ready to be used?
 */
PixelImage.prototype.isReady = function () {
    'use strict';
    return this.pixelIndex !== undefined;
};
    
/** 
 * Get the value of a particular pixel.
 * @returns {Array} Pixel values [r, g, b, a], or an empty pixel if x and y are out of range.
 */
PixelImage.prototype.peek = function (x, y) {
    'use strict';
    var ci;

    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        ci = this.getPixelIndex(x, y);
        return ci !== undefined ? this.palette.get(this.colorMaps[ci].getColor(x, y)) : PixelCalculator.emptyPixel;
    }
    return PixelCalculator.emptyPixel;
};
    
PixelImage.prototype.extractColorMap = function (colorMap) {
    'use strict';
    var x,
        y,
        xx,
        yy,
        rx = colorMap.resX,
        ry = colorMap.resY,
        color,
        curColor,
        pixel;

    for (x = 0; x < this.width; x += rx) {
        for (y = 0; y < this.height; y += ry) {
            // find the maximum used color in this area
            color = this.reduceToMax(x, y, rx, ry);

            if (color !== undefined) {

                colorMap.add(x, y, color);

                // remove matching pixels from this image
                for (xx = x; xx < x + rx; xx += 1) {
                    for (yy = y; yy < y + ry; yy += 1) {
                        pixel = this.getPixelIndex(xx, yy);
                        if (pixel !== undefined) {
                            curColor = this.colorMaps[pixel].getColor(xx, yy);
                            if (color === curColor) {
                                this.setPixelIndex(xx, yy, undefined);
                            }
                        }
                    }
                }
            }

        }
    }

    return colorMap;

};
  
/** 
    Create a URL that can be used as the src for an Image.
    If there is no image data (yet), the URL for a default image is returned.
*/
PixelImage.prototype.toSrcUrl = function () {
    'use strict';
    
    if (this.isReady()) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            imageData,
            x,
            y,
            px,
            py,
            pixel;

        canvas.width = this.width * this.pWidth;
        canvas.height = this.height * this.pHeight;
        imageData = context.createImageData(canvas.width, canvas.height);

        for (x = 0; x < this.width; x += 1) {
            for (y = 0; y < this.height; y += 1) {

                pixel = this.peek(x, y);
                for (px = 0; px < this.pWidth; px += 1) {
                    for (py = 0; py < this.pHeight; py += 1) {
                        PixelCalculator.poke(imageData, x * this.pWidth + px, y * this.pHeight + py, pixel);
                    }
                }
            }
        }

        context.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    } else {
        return 'images/spiffygif_30x30.gif';
    }

};
    
PixelImage.prototype.addColorMap = function (colorMap) {
    'use strict';
    this.colorMaps.push(colorMap);
};

PixelImage.prototype.getTransparencyPercentage = function () {
    'use strict';
    var x, y, count = 0;
    
    for (x = 0; x < this.width; x += 1) {
        for (y = 0; y < this.height; y += 1) {
            count += this.getPixelIndex(x, y) === undefined ? 1 : 0;
        }
    }
    
    return Math.round((100 * count) / (this.width * this.height));
};
    