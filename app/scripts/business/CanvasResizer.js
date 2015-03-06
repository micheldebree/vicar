/** Resizes a PixelImage using a Canvas  */
/*global Resizer, PixelImage, PixelCalculator */
/*exported NearestNeighbour*/
/*jslint plusplus:true*/
function CanvasResizer() {
    
    /** Create a new resized version of an image */
    this.resize = function (srcImage, w, h) {
        'use strict';
        
        var result = new PixelImage(),
            img = srcImage.toImage();
  
        result.imageData = PixelCalculator.getImageData(img, w, h);
        return result;
        
    };

}

CanvasResizer.prototype = new Resizer();
CanvasResizer.prototype.constructor = CanvasResizer;
