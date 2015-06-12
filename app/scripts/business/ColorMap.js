/*global PixelCalculator, console */
/*exported ColorMap*/
/**
 * Maps x, y coordinates to a pixel value.
 * The map has a certain resolution specifying the size of an area of the same color.
 * @param {PixelImage} pixelImage - Image to extract the color map from.
 * @param {number} width - Width of the map in pixels
 * @param {number} height - Height of the map in pixels
 * @param {number} [resX] - Number of horizontal pixels in color areas.
 * @param {number} [resY] - Number of vertical pixels in color areas.
 *
 * A color is an index into a palette. A pixel is a set of RGBA values.
 */

// http://stackoverflow.com/questions/8580540/javascript-calling-private-method-from-prototype-method

function ColorMap(widthVal, heightVal, resXVal, resYVal) {
    'use strict';
    
    this.colors = [];
    this.width = widthVal;
    this.height = heightVal;
    this.resX = resXVal !== undefined ? resXVal : widthVal;
    this.resY = resYVal !== undefined ? resYVal : heightVal;
    
}


ColorMap.prototype.isInRange = function (x, y) {
    'use strict';
    
    return (x >= 0 && x < this.width && y >= 0 && y < this.height);
};

ColorMap.prototype.mapX = function (x) {
    'use strict';
    return Math.floor(x / this.resX);
};

ColorMap.prototype.mapY = function mapY(y) {
    'use strict';
    return Math.floor(y / this.resY);
};

  /**
     * Set an area to a certain color.
     */
ColorMap.prototype.add = function (x, y, color) {
    'use strict';
    if (!this.isInRange(x, y)) {
        return;
    }

    var rx = this.mapX(x),
        ry = this.mapY(y);

    // add it to the color map
    if (this.colors[rx] === undefined) {
        this.colors[rx] = [];
    }
    this.colors[rx][ry] = color;
        
};
    

 /**
     * Fill the map with one color.
     */
ColorMap.prototype.fillWithColor = function (color) {
    'use strict';
    var x,
        y;

    for (x = 0; x < this.width; x += this.resX) {
        for (y = 0; y < this.height; y += this.resY) {
            this.add(x, y, color);
        }
    }
};

 /**
     * Convert to an image so it can be displayed.
     * @param {Palette} the palette to use for looking up the colors.
     */
ColorMap.prototype.toImageData = function toImageData(palette) {
        
    'use strict';
    
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        imageData = context.createImageData(this.width, this.height),
        x,
        y,
        colorIndex,
        color;
        
    for (y = 0; y < this.height; y += 1) {
        for (x = 0; x < this.width; x += 1) {
            colorIndex = this.getColor(x, y);
            color = palette.get(colorIndex);
            PixelCalculator.poke(imageData, x, y, color);
        }
    }

    return imageData;
};

  /**
     * Get the color at x, y coordinate.
     */
ColorMap.prototype.getColor = function (x, y) {
    
    'use strict';
        
    var mX = this.mapX(x),
        mY = this.mapY(y);

    if (this.colors[mX] !== undefined) {
        return this.colors[mX][mY];
    } else {
        return undefined;
    }
    
};
   