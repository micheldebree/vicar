/*global angular, Remapper, PixelImage, Palette, PeptoPalette */
angular.module('vicarApp').factory('c64izerService', function () {
    'use strict';
    
    return {

        convert: function (img, profile, dither, success) {
        
            var image = new PixelImage(),
                remapper = new Remapper();

             // set the palette
            remapper.palette = new Palette();
            remapper.palette.pixels = profile.palette;
            
            // set the ordered dithering algorithm
            remapper.dither = dither;
            
            remapper.pixelWidth = profile.pixelWidth;
            remapper.pixelHeight = profile.pixelHeight;
          
            image.grab(img, function () {

                // remap to c64 palette
                image = remapper.remap(image);

                // call the success callback event
                if (typeof success === 'function') {
                    success(image);
                }
            }, profile.width * profile.pixelWidth);

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


        getSupportedProfiles: function () {
            return [{
                key: 'Commodore 64 multicolor',
                value: {
                    'name': 'Commodore 64 multicolor',
                    'palette': new PeptoPalette().pixels,
                    'pixelWidth': 2,
                    'pixelHeight': 1,
                    'width': 160
                }
            }, {
                key: 'Commodore 64 hires',
                value: {
                    'name': 'Commodore 64 hires',
                    'palette': [[0x44, 0x44, 0x44], [0x95, 0x95, 0x95]],
                    'pixelWidth': 1,
                    'pixelHeight': 1,
                    'width': 320
                }
            }, {
                key: 'Teletext',
                value: {
                    'name': 'Teletext',
                    'palette': [
                        [0xff, 0x00, 0x00],
                        [0x00, 0xff, 0x00],
                        [0x00, 0x00, 0xff],
                        [0x00, 0x00, 0x00],
                        [0xff, 0xff, 0xff],
                        [0xff, 0xff, 0x00],
                        [0x00, 0xff, 0xff],
                        [0xff, 0x00, 0xff]
                    ],
                    'pixelWidth': 8,
                    'pixelHeight': 8,
                    'width': 40
                }
            }, {
                key: 'CGA 1',
                value: {
                    'name': 'CGA palette 1 high intensity',
                    'palette': [
                        [0x00, 0x00, 0x00],
                        [0x55, 0xff, 0xff],
                        [0xff, 0x55, 0xff],
                        [0xff, 0xff, 0xff]
                    ],
                    'pixelWidth': 1,
                    'pixelHeight': 1,
                    'width': 320
                }
            }, {
                key: 'CGA 2',
                value: {
                    'name': 'CGA palette 1 high intensity',
                    'palette': [
                        [0x00, 0x00, 0x00],
                        [0x55, 0xff, 0x55],
                        [0xff, 0x55, 0x55],
                        [0xff, 0xff, 0x55]
                    ],
                    'pixelWidth': 1,
                    'pixelHeight': 1,
                    'width': 320
                }
            }, {
                key: 'Gameboy',
                value: {
                    'name': 'Gameboy 4 colors',
                    'palette': [
                        [0x9c, 0xbd, 0x0f],
                        [0x8c, 0xad, 0x0f],
                        [0x30, 0x62, 0x30],
                        [0x0f, 0x38, 0x0f]
                    ],
                    'pixelWidth': 2,
                    'pixelHeight': 2,
                    'width': 160
                }
            }, {
                key: 'ZX Spectrum',
                value: {
                    'name': 'ZX Spectrum',
                    'palette': [
                        [0x00, 0x00, 0x00],
                        [0xcd, 0x00, 0x00],
                        [0xcd, 0x00, 0xcd],
                        [0x00, 0xcd, 0x00],
                        [0x00, 0xcd, 0xcd],
                        [0xcd, 0xcd, 0x00],
                        [0xcd, 0xcd, 0xcd],
                        [0xff, 0x00, 0x00],
                        [0xff, 0x00, 0xff],
                        [0x00, 0xff, 0x00],
                        [0x00, 0xff, 0xff],
                        [0xff, 0xff, 0x00],
                        [0xff, 0xff, 0xff]
                    ],
                    'pixelWidth': 1,
                    'pixelHeight': 1,
                    'width': 256
                }
            }];
        }
    };
});
