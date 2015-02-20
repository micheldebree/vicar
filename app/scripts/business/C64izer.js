/*global NearestNeighbour, PeptoPalette, PixelImage */

/**
 * Convert an image to c64 style.
 */
function C64izer(img) {
    'use strict';
    this.resizer = new NearestNeighbour();
    this.palette = new PeptoPalette();
    this.onDone = undefined;
    this.image = new PixelImage();
    this.width = 320;
    this.height = 200;
    this.pixelWidth = 2;
    
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        self = this,
        onGrab = function () {

            var sW;

            // resize to 320x200
            self.image = self.resizer.resizeZoom(self.image, self.width, self.height);
            
            // resize to half width
            sW = self.image.getWidth();
            self.image = self.resizer.resize(self.image, sW / self.pixelWidth, self.image.getHeight());
            
            // remap to c64 palette
            self.image = self.palette.remap(self.image);
            
            // resize to original width so we get double width pixels
            self.image = self.resizer.resize(self.image, sW, self.image.getHeight());
            
            // call the onDone event
            if (typeof self.onDone === 'function') {
                self.onDone();
            }
        };

    this.convert = function () {
        self.image.grab(img, onGrab);
    };
}