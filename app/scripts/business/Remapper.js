/*global PixelImage */
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
    function remap(pixelImage, palette) {

        var xi,
            yi,
            pi,
            pixel,
           
            result = new PixelImage(),
            w = pixelImage.getWidth(),
            h = pixelImage.getHeight();

        result.init(w, h);
        result.setPixelAspect(pixelImage.getPixelWidth(), pixelImage.getPixelHeight());

        // add colormaps for every available color
        for (pi = 0; pi < palette.length; pi += 1) {
            result.addAvailableColor(palette[pi]);
        }
             
        for (yi = 0; yi < h; yi += 1) {
            for (xi = 0; xi < w; xi += 1) {
                pixel = pixelImage.peek(xi, yi);

              

                result.poke(xi, yi, pixel, true);
                
                

            }
        }
        return result;

    }
    
   
    
  
    
    return {
        remap: remap
       
    };
    
}

