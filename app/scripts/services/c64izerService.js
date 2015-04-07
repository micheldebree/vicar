/*global angular, Remapper, PixelImage, ColorMap */
angular.module('vicarApp').factory('c64izerService', function () {
    'use strict';

    
    function extractColorMaps(pixelImage) {
    
        var result = [],
            colorMap;
        
        colorMap = new ColorMap(pixelImage, pixelImage.getWidth(), pixelImage.getHeight());
        
        pixelImage.subtract(colorMap.toPixelImage());
        
        result.push(colorMap);
        
        return result;
        
    }
    
    return {

        /**
         * Convert an image.
         * @param {Image} img - The image to convert
         * @param {Object} profile - The profile to use for conversion
         * @param {Array} dither - Matrix to use for ordered dithering
         * @param {Function} success - Success callback, takes the resulting PixelImage as parameter.
         * @param [number] width override - Overrides the width from profile.
         */
        convert: function (img, profile, dither, success, width) {

            var image = new PixelImage(),
                remapper = new Remapper();
            
            width = typeof width !== 'undefined' ? width : profile.width * profile.pixelWidth;

            remapper.setPalette(profile.palette);
            remapper.setDither(dither);
            remapper.setPixelWidth(profile.pixelWidth);
            remapper.setPixelHeight(profile.pixelHeight);

            image.grab(img, function () {

                // remap to c64 palette
                image = remapper.remap(image);
                
                // make a clone
                var image2 = image.clone();
                
                // extract colorMaps
                var colorMaps = extractColorMaps(image2);
                
                var reRemapper = new Remapper();
                reRemapper.setColorMaps(colorMaps);
                
                reRemapper.remap(image);
                

                // call the success callback event
                if (typeof success === 'function') {
                    success(image);
                }
            }, width);

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
                    'palette': [
                        [0, 0, 0, 0xff], // black
                        [0xff, 0xff, 0xff], // white
                        [0x68, 0x37, 0x2b], //red
                        [0x70, 0xa4, 0xb2], //cyan
                        [0x6f, 0x3d, 0x86], //purple
                        [0x58, 0x8d, 0x43], //green
                        [0x35, 0x28, 0x79], //blue
                        [0xb8, 0xc7, 0x6f], //yellow
                        [0x6f, 0x4f, 0x25], //orange
                        [0x43, 0x39, 0x00], //brown
                        [0x9a, 0x67, 0x59], //light red
                        [0x44, 0x44, 0x44], //dark gray
                        [0x6c, 0x6c, 0x6c], //medium gray
                        [0x9a, 0xd2, 0x84], //light green
                        [0x6c, 0x5e, 0xb5], //light blue
                        [0x95, 0x95, 0x95] //green
                    ],
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
                    'width': 320
                }
            }];
        }
    };
});