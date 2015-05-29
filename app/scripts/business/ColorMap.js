/*global Palette, PixelCalculator, console */
/*exported ColorMap*/
/**
 * Maps x, y coordinates to a pixel value.
 * The map has a certain resolution specifying the size of an area of the same color.
 * @param {PixelImage} pixelImage - Image to extract the color map from.
 * @param {number} width - Width of the map in pixels
 * @param {number} height - Height of the map in pixels
 * @param {number} [resX] - Number of horizontal pixels in color areas.
 * @param {number} [resY] - Number of vertical pixels in color areas.
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
    function fillWithColor(pixel) {
        var x,
            y;
      
        for (x = 0; x < width; x += resX) {
            for (y = 0; y < height; y += resY) {
                add(x, y, pixel);
            }
        }
    }
    
    /**
     * Get the color at x, y coordinate.
     */
    function getColor(x, y) {
        
        if (!isInRange(x, y)) {
            return PixelCalculator.emptyPixel;
        }
        
        var mx = mapX(x),
            my = mapY(y),
            result = colors[mx][my];

        // TODO: this should never be undefined..
        if (result !== undefined) {
            return result;
        } else {
            return PixelCalculator.emptyPixel;
        }
      
    }
    
    /**
     * Convert to an image so it can be displayed.
     */
    function toImageData() {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            imageData = context.createImageData(width, height),
            x,
            y;
        
        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                PixelCalculator.poke(imageData, x, y, getColor(x, y));
            }
        }
     
        return imageData;
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
    fillWithColor(PixelCalculator.emptyPixel);
    
    return {
        getColor: getColor,
        fillWithColor: fillWithColor,
        toImageData: toImageData,
        add: add,
        getAreaWidth: getAreaWidth,
        getAreaHeight: getAreaHeight,
        debug: debug
    };
    
}