/** Resizes a PixelImage using nearestneightbour algorithm */
/*global Resizer, PixelImage*/
/*exported NearestNeighbour*/
/*jslint plusplus:true*/
function NearestNeighbour() {
    
    /** Create a new resized version of an image */
    this.resize = function (srcImage, w, h) {
        'use strict';
        var pw = srcImage.getWidth() / w,
            ph = srcImage.getHeight() / h,
            result = new PixelImage(),
            x,
            y = h;

        result.init(w, h);

        while (--y > 0) {
            x = w;
            while (--x > 0) {
                result.poke(x, y, srcImage.peek(x * pw, y * ph));
            }
        }

        return result;
    };

}

NearestNeighbour.prototype = new Resizer();
NearestNeighbour.prototype.constructor = NearestNeighbour;
