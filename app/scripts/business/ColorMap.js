/*global PixelImage, Palette, PixelCalculator */
/*exported ColorMap*/
/**
 * Maps x, y coordinates to a pixel value.
 * The map has a certain resolution specifying the size of an area of the same color.
 * @param {PixelImage} pixelImage - Image to extract the color map from.
 * @param {number} resX - Number of horizontal pixels in color areas.
 * @param {number} resY - Number of vertical pixels in color areas.
 * @param [number] width - Width of the map in pixels
 * @param [number] height - Height of the map in pixels
 */
function ColorMap(resX, resY, width, height) {
    'use strict';
    
    var pixels = [];
    
    function mapX(x) {
        return Math.floor(x / resX);
    }
    
    function mapY(y) {
        return Math.floor(y / resY);
    }
    
    /**
     * Set an area to a certain color.
     */
    function add(x, y, pixel) {
        
        var rx = mapX(x),
            ry = mapY(y);

        // add it to the color map
        if (pixels[rx] === undefined) {
            pixels[rx] = [];
        }
        pixels[rx][ry] = pixel;
        
    }
    
    function setColor(pixel) {
        var x,
            y;
        
        for (x = 0; x < width; x += resX) {
            for (y = 0; y < height; y += resY) {
                add(x, y, pixel);
            }
        }
    }
    
    function getColor(x, y) {
        
        var mx = mapX(x),
            my = mapY(y),
            result;
        
        if (mx < pixels.length) {
            if (my < pixels[mx].length) {
                result = pixels[mx][my];
                // TODO: this should never be undefined..
                if (result !== undefined) {
                    return result;
                } else {
                    return PixelCalculator.emptyPixel;
                }
            }
        } else {
            return PixelCalculator.emptyPixel;
        }
      
    }
    
    /**
     * Gets the maximum color for an area in the image.
     * @param {number} x - x coordinate for upper left of the area
     * @param {number} y - y coordinate for upper left of the area
     * @returns {Array} The pixel (color), or undefined if the palette is empty.
     */
    function getMaxColor(pixelImage, x, y) {
        var xi,
            yi,
            palette = new Palette();
        
        // build up a palette with all the pixels in the area
        for (yi = 0; yi < resY; yi += 1) {
            for (xi = 0; xi < resX; xi += 1) {
                palette.add(pixelImage.peek(x + xi, y + yi));
            }
        }
        
        // return the maximum color from the palette
        return palette.getMaxColor();
    }
    
    /**
     * Fill the ColorMap with the most frequent color in pixelImage for each area.
     */
    function fromPixelImage(pixelImage) {
        
        var x,
            y,
            maxColor;
        
        width = pixelImage.getWidth();
        height = pixelImage.getHeight();
        
        for (y = 0; y < pixelImage.getHeight(); y += resY) {
            for (x = 0; x < pixelImage.getWidth(); x += resX) {
                
                // determine the max color in this area
                maxColor = getMaxColor(pixelImage, x, y, resX, resY);
                add(x, y, maxColor);
                
            }
        }
    }
    
    function getMaxColorFromImageData(imageData, x, y) {
        var xi,
            yi,
            palette;
        
        
        // 1 x 1 does not need max color calculation
        if (resX === 1 && resY === 1) {
            return PixelCalculator.peek(imageData, x, y);
        }
        
        palette = new Palette();
        // build up a palette with all the pixels in the area
        for (yi = 0; yi < resY; yi += 1) {
            for (xi = 0; xi < resX; xi += 1) {
                palette.add(PixelCalculator.peek(imageData, x + xi, y + yi));
            }
        }
        
        // return the maximum color from the palette
        return palette.getMaxColor();
    }
    
    
    function fromImageData(imageData) {
        
        var x,
            y,
            maxColor;
        
        width = imageData.width;
        height = imageData.height;
        
        for (y = 0; y < height; y += resY) {
            for (x = 0; x < width; x += resX) {
                
                // determine the max color in this area
                maxColor = getMaxColorFromImageData(imageData, x, y);
                add(x, y, maxColor);
                
            }
        }
    }
    
    function toImageData() {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            imageData = context.createImageData(width * resX, height * resY),
            x,
            y;
        
        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                PixelCalculator.poke(imageData, x, y, getColor(x, y));
            }
        }
     
        return imageData;
    }
    
    
    
    /**
     * Create a PixelImage to visualize the ColorMap
     */
    function toPixelImage() {
    
        var x,
            y,
            result = new PixelImage();
        
        result.init(width, height);
        
        for (y = 0; y < result.getHeight(); y += 1) {
            for (x = 0; x < result.getWidth(); x += 1) {
                result.poke(x, y, getColor(x, y));
            }
        }
        
        return result;
    }
    
    return {
        getColor: getColor,
        setColor: setColor,
        toPixelImage: toPixelImage,
        fromPixelImage: fromPixelImage,
        fromImageData: fromImageData,
        toImageData: toImageData
    };
    
}