/*exported ImageGrabber*/
/*global PixelCalculator */
function ImageGrabber() {
    'use strict';
    
    var img, // the source for grabbing image data 
        w,
        h,
        callback; // callback after grabbing image data// resize width when grabbing data
        
    /**
     * Call back when img is loaded.
     */
    function grabData() {
        
        w = w === undefined ? img.width : w;
        h = h === undefined ? img.height : h;
        
        var imageData = PixelCalculator.getImageData(img, w, h);

        // call the callback event because the image data is ready
        if (typeof callback === 'function') {
            callback(imageData);
        }
    }
    
    /**
        Grab image data from an image. Grabbing is defered until the image is loaded.
        @param {Image} imgParam - The image from which to grab the data.
        @param {Function} successCallback - Handler executed after data has been grabbed.
        @param {number} [w] - Width to resize the image to.
    */
    function grab(imgParam, successCallback, width, height) {
        
        callback = successCallback;

        img = imgParam;
        w = width;
        h = height;

        if (!img.complete) {
            
            // chain multiple onload functions onto the onload event
            var currentOnLoad = img.onload;
            if (typeof currentOnLoad !== 'function') {
                img.onload = grabData;
            } else {
                img.onload = function () {
                    currentOnLoad();
                    grabData();
                };
            }
        } else {
            grabData();
        }
    }
    
    return {
        grab: grab
    };
}
    