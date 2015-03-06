/*global angular, C64izer, Remapper, PixelImage, NearestNeighbour, CanvasResizer, PeptoPalette */
angular.module('vicarApp').factory('c64izer', function () {
    'use strict';
    
    var image = new PixelImage(),
        resizer = new CanvasResizer(),
        remapper = new Remapper(),
        width = 320,
        height = 200,
        pixelWidth = 2;
    
    return {
        convert: function (img, palette, dither, pixelWidth, success) {

             // set the palette
            remapper.palette = palette;
            
            // set the ordered dithering algorithm
            remapper.dither = dither;
            
            remapper.pixelWidth = pixelWidth;
          
            image.grab(img, function () {
                var sW;

                // resize to 320x200
                image = resizer.resizeWidth(image, width, height);

                // remap to c64 palette
                image = remapper.remap(image);

                // call the success callback event
                if (typeof success === 'function') {
                    success(image);
                }
            });
        },
        getSupportedDithers: function () {
            return remapper.dithers;
        }
    };
});