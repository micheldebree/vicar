/*exported Palette */
/*global PixelCalculator */
function Palette(pixels) {
    
    'use strict';
    
    var counts = [];
    
    pixels = pixels === undefined ? [] : pixels;
    
    function getIndexOf(pixel) {
        var i;
        for (i = 0; i < pixels.length; i += 1) {
            if (PixelCalculator.equals(pixel, pixels[i])) {
                return i;
            }
        }
        return undefined;
    }
    
    function add(pixel) {
        var i = getIndexOf(pixel);
        if (i !== undefined) {
            counts[i] += 1;
        } else {
            pixels.push(pixel);
            counts.push(1);
        }
    }
    
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