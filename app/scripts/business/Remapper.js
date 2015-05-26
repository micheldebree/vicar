/*global PixelImage */
/*exported Remapper*/
/**
 * Remaps a PixelImage to use only colors from a specified palette
 * Remapping of a pixel is done to the nearest pixel in the palette according
 * to euclidian distance.
 */
function Remapper() {
    'use strict';
    
    var pixelWidth = 1,
        pixelHeight = 1,
        dither = [0]; // an n x n matrix used for ordered dithering
     
    
    function setPixelWidth(w) {
        pixelWidth = w;
    }
    
    function setPixelHeight(h) {
        pixelHeight = h;
    }
    
    /*
     * Set an n x n matrix of pixel intensity offsets used for ordered dithering.
     * [0] is no dithering.
     * @param {Array} n x n array of offsets
     */
    function setDither(d) {
        dither = d;
    }
    
    
    
    /**
     * Remap a pixel image
     * @param {PixelImage} pixelImage - The image to remap
     * @param {number} [x=0] - X-coordinate of area to remap
     * @param {number} [y=0] - Y-coordinate of area to remap
     * @param {number} [w] - Width of area to remap
     * @param {number} [h] - Height of area to remap
     */
    function remap(pixelImage, palette, x, y, w, h) {

        var xi,
            yi,
            px,
            py,
            pi,
            pixel,
            ox,
            oy,
            result = new PixelImage();

        x = x !== undefined ? x : 0;
        y = y !== undefined ? y : 0;
        w = w !== undefined ? w : pixelImage.getWidth() - x;
        h = h !== undefined ? h : pixelImage.getHeight() - y;

        result.init(w, h);

        // add colormaps for every available color
        for (pi = 0; pi < palette.length; pi += 1) {
            result.addAvailableColor(palette[pi]);
        }
             
        for (yi = y; yi < y + h; yi += 1) {
            for (xi = x; xi < x + w; xi += 1) {
                pixel = pixelImage.peek(xi, yi);

                ox = (xi / pixelWidth) % dither.length;
                oy = (yi / pixelHeight) % dither.length;

                result.poke(xi, yi, pixel, true);
                
                

            }
        }
        return result;

    }
    
   
    
  
    
    return {
        setPixelWidth: setPixelWidth,
        setPixelHeight: setPixelHeight,
        setDither: setDither,
        remap: remap
       
    };
    
}

