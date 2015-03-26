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
    // an n x n matrix used for ordered dithering
        dither = [0],
        palette;
    
    function map(pixel, offset) {
   
        var i,
            d,
            minVal,
            minI = 0,
            other,
            mappedPixel;

        offset = offset !== undefined ? offset : 0;

        // determine closest pixel in palette (ignoring alpha)
        for (i = 0; i < palette.pixels.length; i += 1) {
            other = palette.pixels[i];

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
        mappedPixel = palette.pixels[minI];

        // preserve alpha channel of original pixel
        mappedPixel[3] = pixel[3];
        return mappedPixel;

    }
    
    function setPalette(p) {
        palette = p;
    }
    
    function setPixelWidth(w) {
        pixelWidth = w;
    }
    
    function setPixelHeight(h) {
        pixelHeight = h;
    }
    
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
    function remap(pixelImage, x, y, w, h) {

        var xi,
            yi,
            px,
            py,
            pixel,
            mappedPixel,
            ox,
            oy;

        x = x !== undefined ? x : 0;
        y = y !== undefined ? y : 0;
        w = w !== undefined ? w : pixelImage.getWidth() - x;
        h = h !== undefined ? h : pixelImage.getHeight() - y;

        for (yi = y; yi < y + h; yi += pixelHeight) {
            for (xi = x; xi < x + w; xi += pixelWidth) {
                pixel = pixelImage.peek(xi, yi);

                ox = (xi / pixelWidth) % dither.length;
                oy = (yi / pixelHeight) % dither.length;

                mappedPixel = map(pixel, dither[oy][ox]);

                for (py = 0; py < pixelHeight; py += 1) {
                    for (px = 0; px < pixelWidth; px += 1) {
                        pixelImage.poke(xi + px, yi + py, mappedPixel);
                    }
                }
            }
        }
        return pixelImage;

    }
    
    return {
        setPalette: setPalette,
        setPixelWidth: setPixelWidth,
        setPixelHeight: setPixelHeight,
        setDither: setDither,
        remap: remap
    };
    
}

