/*global NearestNeighbour, PixelImage, Remapper */
/*exported C64izer */

/**
 * Convert an image to c64 style.
 */
function C64izer() {
    'use strict';
    this.resizer = new NearestNeighbour();
    this.remapper = new Remapper(new PeptoPalette());
    this.image = new PixelImage();
    this.width = 320;
    this.height = 200;
    this.pixelWidth = 2;
    
    var self = this,
        callback,
        onGrab = function () {

            var sW;

            // resize to 320x200
            self.image = self.resizer.resizeZoom(self.image, self.width, self.height);
            
            // resize to half width
            sW = self.image.getWidth();
            self.image = self.resizer.resize(self.image, sW / self.pixelWidth, self.image.getHeight());
            
            // remap to c64 palette
            self.image = self.remapper.remap(self.image);
            
            // resize to original width so we get double width pixels
            self.image = self.resizer.resize(self.image, sW, self.image.getHeight());
            
            // call the callback event
            if (typeof callback === 'function') {
                callback();
            }
        };

    this.convert = function (img, successCallback) {
        callback = successCallback;
        self.image.grab(img, onGrab);
    };
}