/*exported ImageGrabber*/
function ImageGrabber(img, width, height) {
    'use strict';
    
    var successCallback;
    
    function grabData() {
        
        var w = width === undefined ? img.width : width,
            h = height === undefined ? img.height : height,
            canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = w;
        canvas.height = h;
        context.drawImage(img, 0, 0, w, h);

        successCallback(context.getImageData(0, 0, w, h));
      
    }

    function grab(callback) {
        successCallback = callback;
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
    