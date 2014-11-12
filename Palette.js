function Palette(pixels) {
    this.pixels = pixels;
}

Palette.prototype.map = function(pixel) {

    var i,
        d,
        minVal = null,
        minI = null;

    for (i = 0; i < this.pixels.length; i++) {
        d = pixel.getDistance(this.pixels[i]);
        
        if (minVal == null) {
            minVal = d;
            minI = i;
        }
        else if (d < minVal) {
            minVal =  d;
            minI = i;
        }
        
    }
    
    return this.pixels[minI];

};

Palette.prototype.remap = function(pixelImage) {
    
    for (var y = 0; y < pixelImage.getHeight(); y++) {
        for (var x = 0; x < pixelImage.getWidth(); x++ ) {
            var pixel = pixelImage.peek(x,y);
            var newPixel = this.map(pixel);
            pixelImage.poke(x, y, newPixel);
        }
    }
    return pixelImage;
    
};