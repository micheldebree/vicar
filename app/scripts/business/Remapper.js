/*global PixelImage, PixelCalculator */
/*exported Remapper*/
/**
 * Remaps a PixelImage to use only colors from a specified palette
 * Remapping of a pixel is done to the nearest pixel in the palette according
 * to euclidian distance.
 */
function Remapper() {
    'use strict';
    
    /**
     * Remap a pixel image
     * @param {PixelImage} pixelImage - The image to remap
     */
    function remap(imageData, palette, pX, pY) {

        var xi,
            yi,
            pi,
            pixel,
            result = new PixelImage(),
            w = imageData.width,
            h = imageData.height;

        result.init(w / pX, h / pY);
        result.setPixelAspect(pX, pY);
        
        // add colormaps for every available color
        for (pi = 0; pi < palette.length; pi += 1) {
            result.addAvailableColor(palette[pi]);
        }
             
        for (yi = 0; yi < h; yi += pY) {
            for (xi = 0; xi < w; xi += pX) {
                pixel = PixelCalculator.peek(imageData, xi, yi);
                result.poke(xi / pX, yi / pY, pixel, true);
            }
        }
        return result;

    }
    return {
        remap: remap
       
    };
    
}

