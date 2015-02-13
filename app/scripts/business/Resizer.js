/** Resizes a PixelImage using nearestneightbour algorithm */
/*global PixelImage*/
/*exported NearestNeighbour*/
/*jslint plusplus:true*/
function Resizer() {
    'use strict';
    this.resize = undefined;
}

/** Resize the height and keep aspect ratio */
Resizer.prototype.resizeHeight = function (srcImage, h) {
    'use strict';
    return this.resize(srcImage, h * srcImage.getWidth() / srcImage.getHeight(), h);
};

/** Resize the width and keep aspect ratio */
Resizer.prototype.resizeWidth = function (srcImage, w) {
    'use strict';
    return this.resize(srcImage, w, w * srcImage.getHeight() / srcImage.getWidth());
};

/** Resize image to fit in bounding box and retain aspect ratio */
Resizer.prototype.resizeBounding = function (srcImage, w, h) {
    'use strict';
    var srcratio = srcImage.getWidth() / srcImage.getHeight(),
        dstratio = w / h;
    if (srcratio > dstratio) {
        return this.resizeWidth(srcImage, w);
    }
    return this.resizeHeight(srcImage, h);
};