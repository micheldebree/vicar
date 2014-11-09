function NearestNeighbour() {

    this.Downsize = function(canvas, w, h) {
        
        var stepX = canvas.width / w,
            stepY = canvas.height / h,
            x, xx,
            y, yy,
            r, g, b,
            pixels = canvas.getImageData();

        for (x = 0; x < canvas.width; x += stepX) {
            for (y = 0; y < canvas.heigth; y += stepY) {
                r = 0;
                g = 0;
                b = 0;
                for (yy = y; yy < y + stepY; y++) {
                    for (xx = x; xx < x + stepX; xx++) {
                        pixels[yy * w + xx];
                    }
                }    
            }
        }
    };

}
