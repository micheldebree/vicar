/*global PixelImage, Palette, PixelCalculator */
/*exported ColorMap*/
/**
 * Maps x, y coordinates to a pixel value.
 * @param {PixelImage} pixelImage - Image to extract the color map from.
 * @param {number} resX - Number of horizontal pixels in color areas.
 * @param {number} resY - Number of vertical pixels in color areas.
 */
function ColorMap(pixelImage, resX, resY) {
    'use strict';
    
    var pixels = [];
    
    function add(x, y, pixel) {
        
        var rx = Math.floor(x / resX),
            ry = Math.floor(y / resY);

        // add it to the color map
        if (pixels[rx] === undefined) {
            pixels[rx] = [];
        }
        pixels[rx][ry] = pixel;
        
    }
    
    function getColor(x, y) {
        
        var mx = Math.floor(x / resX),
            my = Math.floor(y / resY);
        
        if (mx < pixels.length) {
            if (my < pixels[mx].length) {
                return pixels[mx][my];
            }
        } else {
            return PixelCalculator.emptyPixel;
        }
        
      
    }
    
    function getMaxColor(pixelImage, x, y) {
        var xi,
            yi,
            pixel,
            palette = new Palette();
        for (yi = 0; yi < resY; yi += 1) {
            for (xi = 0; xi < resX; xi += 1) {
                pixel = pixelImage.peek(x + xi, y + yi);
                if (!PixelCalculator.isEmpty(pixel)) {
                    palette.add(pixel);
                }
            }
        }
        
        return palette.getMaxColor();
    }
    
    
    
    function extract(pixelImage) {
        
        var x,
            y,
            maxColor;
        
        for (y = 0; y < pixelImage.getHeight(); y += resY) {
            for (x = 0; x < pixelImage.getWidth(); x += resX) {
                
                // determine the max color in this area
                maxColor = getMaxColor(pixelImage, x, y, resX, resY);
                add(x, y, maxColor);
                
            }
        }
    }
    
    function toPixelImage() {
    
        var x,
            y,
            result = new PixelImage();
        
        result.init(pixelImage.getWidth(), pixelImage.getHeight());
        
        for (y = 0; y < result.getHeight(); y += 1) {
            for (x = 0; x < result.getWidth(); x += 1) {
                result.poke(x, y, getColor(x, y));
            }
        }
        
        return result;
    }
    
    extract(pixelImage);
    
    return {
        getColor: getColor,
        toPixelImage: toPixelImage
    };
    
}