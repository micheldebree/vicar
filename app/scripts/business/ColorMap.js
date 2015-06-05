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
function ColorMap(width, height, resX, resY) {
    'use strict';
    
    var colors = [];
    
    function isInRange(x, y) {
        return (x >= 0 && x < width && y >= 0 && y < height);
    }
    
    function mapX(x) {
        return Math.floor(x / resX);
    }
    
    function mapY(y) {
        return Math.floor(y / resY);
    }
    
    /**
     * Set an area to a certain color.
     */
    function add(x, y, color) {

        if (!isInRange(x, y)) {
            return;
        }
        
        var rx = mapX(x),
            ry = mapY(y);

        // add it to the color map
        if (colors[rx] === undefined) {
            colors[rx] = [];
        }
        colors[rx][ry] = color;
        
    }
    
    /**
     * Fill the map with one color.
     */
    function fillWithColor(color) {
        var x,
            y;
      
        for (x = 0; x < width; x += resX) {
            for (y = 0; y < height; y += resY) {
                add(x, y, color);
            }
        }
    }
    
    /**
     * Get the color at x, y coordinate.
     */
    function getColor(x, y) {
        
        var mX = mapX(x),
            mY = mapY(y);
        
        if (colors[mX] !== undefined) {
            return colors[mX][mY];
        } else {
            return undefined;
        }
    
    }
    
    /**
     * Convert to an image so it can be displayed.
     * @param {Palette} the palette to use for looking up the colors.
     */
    function toImageData(palette) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            imageData = context.createImageData(width, height),
            x,
            y,
            colorIndex,
            color;
        
        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                colorIndex = getColor(x, y);
                color = palette.get(colorIndex);
                PixelCalculator.poke(imageData, x, y, color);
            }
        }
     
        return imageData;
    }
    
    function getWidth() {
        return width;
    }
    
    function getHeight() {
        return height;
    }
    
    function getAreaWidth() {
        return resX;
    }
    
    function getAreaHeight() {
        return resY;
    }
    
    function debug() {
        console.log(width + ' x ' + height + ' pixels (' + resX + ' x ' + resY + ' resolution) ' + (width / resX) + ' x ' + (height / resY) + ' areas');
        console.log(colors);
    }
    
    // init
    resX = resX !== undefined ? resX : width;
    resY = resY !== undefined ? resY : height;
    
    return {
        getColor: getColor,
        fillWithColor: fillWithColor,
        toImageData: toImageData,
        add: add,
        getWidth: getWidth,
        getHeight: getHeight,
        getAreaWidth: getAreaWidth,
        getAreaHeight: getAreaHeight,
        debug: debug
    };
    
}