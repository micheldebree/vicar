/*global Palette*/
/*exported WeightedPalette*/
function WeightedPalette() {
    'use strict';
    
    this.palette = new Palette();
    this.weight = [];
    
    /**
     * Extract a palette from an image
     */
    this.extract = function (pixelImage) {
        var x,
            y,
            w = pixelImage.getWidth(),
            h = pixelImage.getHeight(),
            pixel,
            paletteIndex;
        
        for (y = 0; y < h; y += 1) {
            for (x = 0; x < w; x += 1) {
                pixel = pixelImage.peek(x, y);
                paletteIndex = this.palette.getIndexOf(pixel);
                if (typeof paletteIndex !== 'undefined') {
                    this.weight[paletteIndex] += 1;
                } else {
                    this.palette.pixels.push(pixel);
                    this.weight[this.palette.pixels.length - 1] = 1;
                }
            }
        }
    };
    
    /**
     * Splice (return and remove) the pixel with the most weight from the palette
     */
    this.spliceHeaviest = function () {
        var i,
            weight,
            maxWeight,
            maxIndex;
        for (i = 0; i < this.weight.length; i += 1) {
            weight = this.weight[i];
            if (typeof maxWeight === 'undefined' || weight > maxWeight) {
                maxIndex = i;
                maxWeight = weight;
            }
            
        }
        
        if (typeof maxIndex !== 'undefined') {
            this.weight.splice(maxIndex, 1);
            return this.palette.splice(maxIndex, 1);
        } else {
            return undefined;
        }
        
    };
    
    /**
     * Reduce the palette to the <max> heaviest colors.
     */
    this.reduce = function (max) {
        var i,
            pixel,
            newPalette = new Palette();
        
        for (i = 0; i < max; i += 1) {
            pixel = this.spliceHeaviest();
            if (typeof pixel !== 'undefined') {
                newPalette.pixels.push(pixel);
            }
        }
        
        this.palette = newPalette;
        
    };
    
}
