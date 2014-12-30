/** Resizes a PixelImage using nearestneightbour algorithm */
/*global PixelImage*/
/*exported NearestNeighbour*/
/*jslint plusplus:true*/
function NearestNeighbour() {
    'use strict';
    /** Resize the height and keep aspect ratio */
    this.resizeHeight = function (srcImage, h) {
        return this.resize(srcImage, h * srcImage.getWidth() / srcImage.getHeight(), h);
    };

    /** Resize the width and keep aspect ratio */
    this.resizeWidth = function (srcImage, w) {
        return this.resize(srcImage, w, w * srcImage.getHeight() / srcImage.getWidth());
    };

    /** Resize image to fit in bounding box and retain aspect ratio */
    this.resizeBounding = function (srcImage, w, h) {
        var srcratio = srcImage.getWidth() / srcImage.getHeight(),
            dstratio = w / h;
        if (srcratio > dstratio) {
            return this.resizeWidth(srcImage, w);
        }
        return this.resizeHeight(srcImage, h);
    };

    /** Create a new resized version of an image */
    this.resize = function (srcImage, w, h) {
        var pw = srcImage.getWidth() / w,
            ph = srcImage.getHeight() / h,
            result = new PixelImage(),
            x,
            y = h;

        result.init(w, h);

        while (y-- > 0) {
            x = w;
            while (x-- > 0) {
                result.poke(x, y, this.sample(srcImage, x * pw, y * ph));
            }
        }

        return result;

    };

    this.sample = function (srcImage, x, y) {
        return srcImage.peek(x, y);
    };

}
