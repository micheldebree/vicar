/*exported Palette */
/*global PixelCalculator */
function Palette(pixels) {
    
    'use strict';
    
    // TODO: obsolete?
    var counts = [];
    
    pixels = pixels === undefined ? [] : pixels;
    
    function get(index) {
        return pixels[index];
    }
    
    /**
     * Get the index of a pixel (color) in this palette.
     * @returnsthe index
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
     * TODO: obsolete?
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
    
    /** 
     * Get the euclidian distance for a pixel to the pixel in the palette at index
     */
    function getDistance(pixel, index, offset) {
        
        var other = pixels[index];
        
        offset = offset !== undefined ? offset : 0;
        
        if (other !== undefined) {
        
            return Math.sqrt(
                Math.pow(pixel[0] - other[0] - offset, 2) +
                        Math.pow(pixel[1] - other[1] - offset, 2) +
                        Math.pow(pixel[2] - other[2] - offset, 2)
            );
        }
        
    }
    
    /**
     * Map a pixel to the closest available color in the palette.
     * @returns the index into the palette
     */
    function mapPixel(pixel, offset) {
   
        offset = offset !== undefined ? offset : 0;
        
        var i,
            d,
            minVal,
            minI;
        
        // determine closest pixel in palette (ignoring alpha)
        for (i = 0; i < pixels.length; i += 1) {
            // calculate distance
            d = getDistance(pixel, i, offset);

            if (minVal === undefined || d < minVal) {
                minVal = d;
                minI = i;
            }
        }
       
        return minI;

    }
    
    function getSize() {
        return pixels.length;
    }
     
    return {
        getSize: getSize,
        get: get,
        add: add,
        mapPixel: mapPixel,
        getMaxColor: getMaxColor,
        getDistance: getDistance
    };
    
}