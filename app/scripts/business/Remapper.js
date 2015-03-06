/*global PixelCalculator*/
/*exported Remapper*/
function Remapper(palette) {
    'use strict';
    
    this.pixelWidth = 2;
    this.palette = palette;
    this.dithers = [{
        key: 'None',
        value: [0]
    }, {
        key: '2 x 2',
        value: [[1, 3],
                [4, 2]]
    }, {
        key: '4 x 4',
        value: [
            [1, 9, 3, 11],
            [13, 5, 15, 7],
            [4, 12, 2, 10],
            [16, 8, 14, 6]
        ]
    }, {
        key: '8 x 8',
        value: [
            [1, 49, 13, 61, 4, 52, 16, 64],
            [33, 17, 45, 29, 36, 20, 48, 31],
            [9, 57, 5, 53, 12, 60, 8, 56],
            [41, 25, 37, 21, 44, 28, 40, 24],
            [3, 51, 15, 63, 2, 50, 14, 62],
            [35, 19, 47, 31, 34, 18, 46, 30],
            [11, 59, 7, 55, 10, 58, 6, 54],
            [43, 27, 39, 23, 42, 26, 38, 22]
        ]
    }];
    
    this.dither = this.dithers[0].value;
    
    var self = this,
        map = function (pixel, offset) {
   
            var i = self.palette.pixels.length,
                d,
                minVal,
                minI = 0;

            offset = offset !== undefined ? offset : 0;
            while (--i >= 0) {

                d = PixelCalculator.getDistance(pixel, self.palette.pixels[i], offset);

                if (minVal === undefined || d < minVal) {
                    minVal = d;
                    minI = i;
                }
            }

            return self.palette.pixels[minI];

        };
  
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

