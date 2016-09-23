/*global angular, Remapper, ErrorDiffusionDitherer, GraphicModes */
angular.module('vicarApp').factory('c64izerService', function() {
    'use strict';

    function convertToPixelImage(imageData, restrictedImage) {
        return new Remapper(restrictedImage).mapImageData(imageData);
    }

    return {
        convertToPixelImage: convertToPixelImage,
        supportedGraphicModes: [{
            key: 'Multicolor',
            value: GraphicModes.c64Multicolor
        }, {
            key: 'FLI',
            value: GraphicModes.c64FLI
        }, {
            key: 'AFLI',
            value: GraphicModes.c64AFLI
        }, {
            key: 'Hires',
            value: GraphicModes.c64Hires
        }],
        supportedDithers: [{
            key: 'None',
            value: [
                [0]
            ]
        }, {
            key: 'Bayer 2 x 2',
            value: [
                [1, 3],
                [4, 2]
            ]
        }, {
            key: 'Bayer 4 x 4',
            value: [
                [1, 9, 3, 11],
                [13, 5, 15, 7],
                [4, 12, 2, 10],
                [16, 8, 14, 6]
            ]
        }, {
            key: 'Bayer 8 x 8',
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
        }],
        supportedErrorDiffusionDithers: [{
            key: 'None',
            value: function() {}
        }, {
            key: 'Floyd-Steinberg',
            value: ErrorDiffusionDitherer.fsDither
        }, {
            key: 'Jarvis, Judice and Ninke',
            value: ErrorDiffusionDitherer.jjnDither
        }, {
            key: 'Atkinson',
            value: ErrorDiffusionDitherer.atkinsonDither
        }],
        supportedPsychedelicModes: [{
            key: 'None',
            value: [1, 1, 1]
        }, {
            key: 'Rainbow',
            value: [1, 0, 0]
        }, {
            key: 'Candy',
            value: [1, 0, 1]
        }, {
            key: 'Forest',
            value: [1, 1, 0]
        }]
    };
});
