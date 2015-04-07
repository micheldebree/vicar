/*exported Quantizer */
/*global PixelImage, PixelCalculator, Palette */
function Quantizer() {
    
    'use strict';
    
    function getMaxColor(pixelImage, x, y, w, h) {
        var xi,
            yi,
            pixel,
            palette = new Palette();
        for (yi = 0; yi < h; yi += 1) {
            for (xi = 0; xi < w; xi += 1) {
                pixel = pixelImage.peek(x + xi, y + yi);
                if (pixel[3] > 0) {
                    palette.add(pixelImage.peek(x + xi, y + yi));
                }
            }
        }
        
        return palette.getMaxColor();
    }
    
    function quantize(pixelImage, w, h) {
        
        var x,
            y,
            xi,
            yi,
            result = new PixelImage(),
            maxColor;
        
        result.init(pixelImage.getWidth(), pixelImage.getHeight());
        
        for (y = 0; y < pixelImage.getHeight(); y += h) {
            for (x = 0; x < pixelImage.getWidth(); x += w) {
                
                // determine the max color in this area
                maxColor = getMaxColor(pixelImage, x, y, w, h);
                
                if (maxColor !== undefined) {
                    for (yi = 0; yi < h; yi += 1) {
                        for (xi = 0; xi < w; xi += 1) {
                            if (PixelCalculator.equals(maxColor, pixelImage.peek(x + xi, y + yi))) {
                                result.poke(x + xi, y + yi, maxColor);
                            }
                        }
                    }
                }
            }
        }
    
        return result;
    }
    
    return {
        quantize: quantize
    };
    
}