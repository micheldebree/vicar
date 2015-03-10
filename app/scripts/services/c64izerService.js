/*global angular, C64izer, Remapper, PixelImage, NearestNeighbour, CanvasResizer, PeptoPalette, ViceRGBPalette, ViceRGBPALPalette */
angular.module('vicarApp').factory('c64izerService', function () {
    'use strict';
    
    var image = new PixelImage(),
        resizer = new CanvasResizer(),
        remapper = new Remapper(),
        width = 320,
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

                // resize to 320 width
                image = resizer.resizeWidth(image, width);

                // remap to c64 palette
                image = remapper.remap(image);

                // call the success callback event
                if (typeof success === 'function') {
                    success(image);
                }
            });
        },
        getSupportedDithers: function () {
            return [{
                key: 'None',
                value: [0]
            }, {
                key: '2 x 2',
                value: [[1, 3],
                        [4, 2]]
            }, {
                key: '4 x 4',
                value: [
                    [1, 9, 3, 11],
                    [13, 5, 15, 7],
                    [4, 12, 2, 10],
                    [16, 8, 14, 6]
                ]
            }, {
                key: '8 x 8',
                value: [
                    [1, 49, 13, 61, 4, 52, 16, 64],
                    [33, 17, 45, 29, 36, 20, 48, 31],
                    [9, 57, 5, 53, 12, 60, 8, 56],
                    [41, 25, 37, 21, 44, 28, 40, 24],
                    [3, 51, 15, 63, 2, 50, 14, 62],
                    [35, 19, 47, 31, 34, 18, 46, 30],
                    [11, 59, 7, 55, 10, 58, 6, 54],
                    [43, 27, 39, 23, 42, 26, 38, 22]
                ]
            }];
        },
        getSupportedPalettes: function () {
            return [{
                key: 'Pepto',
                value: new PeptoPalette()
            }, {
                key: 'Vice RGB',
                value: new ViceRGBPalette()
            }, {
                key: 'Vice RGB PAL',
                value: new ViceRGBPALPalette()
            }];
        },
        getSupportedPixelWidths: function () {
            return [{
                key: '1:1',
                value: 1
            }, {
                key: '2:1',
                value: 2
            }];
        }
    };
});