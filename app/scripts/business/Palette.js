/*exported Palette */
/*global PixelCalculator */
function Palette(pixels) {
    
    'use strict';
    
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
        mapPixel: mapPixel,
        getDistance: getDistance
    };
    
}

// TODO: put this somewhere but not in a global variable
var peptoPallette = new Palette([
    [0, 0, 0, 0xff], // black
    [0xff, 0xff, 0xff, 0xff], // white
    [0x68, 0x37, 0x2b, 0xff], //red
    [0x70, 0xa4, 0xb2, 0xff], //cyan
    [0x6f, 0x3d, 0x86, 0xff], //purple
    [0x58, 0x8d, 0x43, 0xff], //green
    [0x35, 0x28, 0x79, 0xff], //blue
    [0xb8, 0xc7, 0x6f, 0xff], //yellow
    [0x6f, 0x4f, 0x25, 0xff], //orange
    [0x43, 0x39, 0x00, 0xff], //brown
    [0x9a, 0x67, 0x59, 0xff], //light red
    [0x44, 0x44, 0x44, 0xff], //dark gray
    [0x6c, 0x6c, 0x6c, 0xff], //medium gray
    [0x9a, 0xd2, 0x84, 0xff], //light green
    [0x6c, 0x5e, 0xb5, 0xff], //light blue
    [0x95, 0x95, 0x95, 0xff] //green
]);