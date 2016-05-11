/*exported ImageGrabber*/
function ImageGrabber(img, pixelImage) {
    'use strict';

    var successCallback;

    function grabData() {

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            sourceLeft,
            sourceTop,
            cropwidth,
            cropheight;

        canvas.width = pixelImage.width * pixelImage.pWidth;
        canvas.height = pixelImage.height * pixelImage.pHeight;

        // fill up the image
        var destratio = canvas.width / canvas.height;
        var srcratio = img.width / img.height;
        cropwidth = srcratio > destratio ? img.height * destratio : img.width;
        cropheight = srcratio > destratio ? img.height : img.width / destratio;
        sourceLeft = (img.width - cropwidth) / 2;
        sourceTop = (img.height - cropheight) / 2;

        context.drawImage(img, sourceLeft, sourceTop, cropwidth, cropheight, 0, 0, pixelImage.width, pixelImage.height);

        successCallback(context.getImageData(0, 0, pixelImage.width, pixelImage.height));

    }

    function grab(callback) {
        successCallback = callback;
        if (!img.complete) {

            // chain multiple onload functions onto the onload event
            var currentOnLoad = img.onload;
            if (typeof currentOnLoad !== 'function') {
                img.onload = grabData;
            } else {
                img.onload = function() {
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
