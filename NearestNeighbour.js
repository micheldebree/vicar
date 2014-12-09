/** Resizes a PixelImage using nearestneightbour algorithm */
/* global PixelImage */
function NearestNeighbour() {

    /** Resize the height and keep aspect ratio */
    this.resizeHeight = function(srcImage, h) {
        return this.resize(srcImage, h * srcImage.getWidth() / srcImage.getHeight(), h);
    };

    /** Resize the width and keep aspect ratio */
    this.resizeWidth = function(srcImage, w) {
        return this.resize(srcImage, w, w * srcImage.getHeight() / srcImage.getWidth());
    };

    /** Resize image to fit in bounding box and retain aspect ratio */
    this.resizeBounding = function(srcImage, w, h) {
        var srcratio = srcImage.getWidth() / srcImage.getHeight();
        var dstratio = w / h;
        if (srcratio > dstratio) {
            return this.resizeWidth(srcImage, w);
        }
        else {
            return this.resizeHeight(srcImage, h);
        }
    };

    /** Create a new resized version of an image */
    this.resize = function(srcImage, w, h) {

        var pw = srcImage.getWidth() / w,
            ph = srcImage.getHeight() / h,
            result = new PixelImage();

        result.init(w, h);

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                result.poke(x, y, this.sample(srcImage, x * pw, y * ph));
            }
        }

        return result;

    };

    this.sample = function(srcImage, x, y) {
        return srcImage.peek(x, y);
    };

}
