/*global PixelCalculator*/
/*exported Remapper*/
/**
 * Remaps a PixelImage to use only colors from a specified palette
 * Remapping of a pixel is done to the nearest pixel in the palette according
 * to euclidian distance.
 */
function Remapper(palette) {
    'use strict';
    
    this.pixelWidth = 1;
    this.palette = palette;
    
    // an n x n matrix used for ordered dithering
    this.dither = [0];
    
    var self = this,
        map = function (pixel, offset) {
   
            var i = self.palette.pixels.length,
                d,
                minVal,
                minI = 0,
                other;

            offset = offset !== undefined ? offset : 0;
            
            // determin closest pixel in palette
            for (i = 0; i < self.palette.pixels.length; i += 1) {
                other = self.palette.pixels[i];
                
                // calculate distance
                d = Math.sqrt(
                    Math.pow(pixel[0] - other[0] - offset, 2) +
                        Math.pow(pixel[1] - other[1] - offset, 2) +
                        Math.pow(pixel[2] - other[2] - offset, 2)
                );

                if (minVal === undefined || d < minVal) {
                    minVal = d;
                    minI = i;
                }
            }

            return self.palette.pixels[minI];

        };
  
    /**
     * Remap a pixel image
     * @param {PixelImage} pixelImage - The image to remap
     * @param {number} [x=0] - X-coordinate of area to remap
     * @param {number} [y=0] - Y-coordinate of area to remap
     * @param {number} [w] - Width of area to remap
     * @param {number} [h] - Height of area to remap
     */
    this.remap = function (pixelImage, x, y, w, h) {

        var xi,
            yi,
            pi,
            pixel,
            mappedPixel,
            ox,
            oy;

        x = x !== undefined ? x : 0;
        y = y !== undefined ? y : 0;
        w = w !== undefined ? w : pixelImage.getWidth() - x;
        h = h !== undefined ? h : pixelImage.getHeight() - y;

        for (yi = y; yi < y + h; yi += 1) {
            for (xi = x; xi < x + w; xi += this.pixelWidth) {
                pixel = pixelImage.peek(xi, yi);

                ox = (xi / this.pixelWidth) % self.dither.length;
                oy = yi % self.dither.length;

                mappedPixel = map(pixel, self.dither[oy][ox]);
                
                for (pi = 0; pi < this.pixelWidth; pi += 1) {
                    pixelImage.poke(xi + pi, yi, mappedPixel);
                }
            }
        }
        return pixelImage;

    };
}

