/*global document, PixelCalculator, ColorMap */
/*exported PixelImage*/
/*jslint bitwise: true*/
/** Create an image with access to individual pixels 
    
    Pixels are indexed:
    - index 0 = transparant
    - index > 0 = color is stored in color map with that index (-1, as actual array starts at 0)

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
    this.dither = [
        [1, 49, 13, 61, 4, 52, 16, 64],
        [33, 17, 45, 29, 36, 20, 48, 31],
        [9, 57, 5, 53, 12, 60, 8, 56],
        [41, 25, 37, 21, 44, 28, 40, 24],
        [3, 51, 15, 63, 2, 50, 14, 62],
        [35, 19, 47, 31, 34, 18, 46, 30],
        [11, 59, 7, 55, 10, 58, 6, 54],
        [43, 27, 39, 23, 42, 26, 38, 22]];
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
PixelImage.prototype.map = function (pixel, x, y, offset) {
    'use strict';
   
    var i,
        d,
        minVal,
        minI = 0,
        other;

    // determine closest pixel in palette (ignoring alpha)
    for (i = 0; i < this.colorMaps.length; i += 1) {
        other = this.colorMaps[i].getColor(x, y);
        d = this.palette.getDistance(pixel, other, offset);
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
    
/** 
 * Set the value for a particular pixel. 
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @param {Array] pixel - Pixel values [r, g, b, a]
 */
PixelImage.prototype.poke = function (x, y, pixel) {
    'use strict';
    // check if a colorMap already has this color
    var mappedPixel,
        colorMap,
        ox = x % this.dither.length,
        oy = y % this.dither.length,
        offset = this.dither[oy][ox];

    // map to closest color in palette
    mappedPixel = this.palette.mapPixel(pixel, offset);

    // try to reuse existing color map 
    colorMap = this.findColorMap(x, y, mappedPixel);
    if (colorMap !== undefined) {
        this.colorMaps[colorMap].add(x, y, mappedPixel);
    } else {
         // if all else fails, map to closest existing color
        if (colorMap === undefined) {
            colorMap = this.map(pixel, x, y, offset);
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
 * Get the value of a particular pixel.
 * @returns {Array} Pixel values [r, g, b, a], or an empty pixel if x and y are out of range.
 */
PixelImage.prototype.peek = function (x, y) {
    'use strict';
    var ci = this.getPixelIndex(x, y);
    return ci !== undefined ? this.palette.get(this.colorMaps[ci].getColor(x, y)) : PixelCalculator.emptyPixel;
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
    
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        imageData,
        x,
        y,
        px,
        py,
        xx,
        yy,
        pixel;

    canvas.width = this.width * this.pWidth;
    canvas.height = this.height * this.pHeight;
    imageData = context.createImageData(canvas.width, canvas.height);

    for (x = 0; x < this.width; x += 1) {
        for (y = 0; y < this.height; y += 1) {

            pixel = this.peek(x, y);
            for (px = 0; px < this.pWidth; px += 1) {
                xx = x * this.pWidth + px;
                yy = y * this.pHeight;
                for (py = 0; py < this.pHeight; py += 1) {
                    PixelCalculator.poke(imageData, xx, yy + py, pixel);
                }
            }
        }
    }

    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
    

};
    
PixelImage.prototype.addColorMap = function (colorMap) {
    'use strict';
    this.colorMaps.push(colorMap);
};
    