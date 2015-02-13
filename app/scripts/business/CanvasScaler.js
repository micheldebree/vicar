/** Scale image by using a canvas */
function CanvasScaler() {
    'use strict';
    
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    
    this.resize = function (srcImage, w, h) {
    
        var rW = w / srcImage.getWidth(),
            rH = h / srcImage.getHeight(),
            fW =  srcImage.getWidth() / 2,
            fH = srcImage.getHeight / 2;
        
        // recursively scale down by factors of 2 because
        // this is supposed to interpolate better
        if (rW < fW && rH < fH) {
            srcImage = this.resize(srcImage, fW, fH);
        }
       
        canvas.width = w;
        canvas.height = h;
        context.putImageData(srcImage.imageData(), 0, 0, 0, 0, w, h);
    
    };
    
}
