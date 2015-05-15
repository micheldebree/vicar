/*exported Palette */
/*global PixelCalculator */
function Palette(pixels) {
    
    'use strict';
    
    var counts = [];
    
    pixels = pixels === undefined ? [] : pixels;
    
    /**
     * Get the location of a pixel (color) in this palette.
     * @returns
     */
    function getIndexOf(pixel) {
        var i;
        for (i = 0; i < pixels.length; i += 1) {
            if (PixelCalculator.equals(pixel, pixels[i])) {
                return i;
            }
        }
        return undefined;
    }
    
    
    /**
     * Add a pixel to the palette.
     * If a corresponding pixel (color) is already in the palette, its count is increased.
     */
    function add(pixel) {
        
        // don't add empty pixels
        if (PixelCalculator.isEmpty(pixel)) {
            return;
        }
        
        var i = getIndexOf(pixel);
        if (i !== undefined) {
            counts[i] += 1;
        } else {
            pixels.push(pixel);
            counts.push(1);
        }
    }
    
    /**
     * Gets the pixel that has the biggest count in this palette.
     */
    function getMaxColor() {
        
        var i, max, maxI;
        for (i = 0; i < counts.length; i += 1) {
            if (max === undefined || max < counts[i]) {
                max = counts[i];
                maxI = i;
            }
        }
        
        if (maxI !== undefined) {
            return pixels[maxI];
        } else {
            return undefined;
        }
        
    }
     
    return {
        add: add,
        getMaxColor: getMaxColor
    };
    
}