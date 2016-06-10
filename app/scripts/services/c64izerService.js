/*global angular, PixelImage, ColorMap, Remapper, peptoPalette */
angular.module('vicarApp').factory('c64izerService', function() {
  'use strict';

  function weighError(error, mul, div) {
    return [
      (error[0] * mul) / div, (error[1] * mul) / div, (error[2] * mul) / div
    ];
  }

  function fsDither(pixelImage, x, y, error) {
    pixelImage.addDitherOffset(x + 1, y, weighError(error, 7, 16));
    pixelImage.addDitherOffset(x - 1, y + 1, weighError(error, 3, 16));
    pixelImage.addDitherOffset(x, y + 1, weighError(error, 5, 16));
    pixelImage.addDitherOffset(x + 1, y + 1, weighError(error, 1, 16));
  }

  function jjnDither(pixelImage, x, y, error) {
    pixelImage.addDitherOffset(x + 1, y, weighError(error, 7, 48));
    pixelImage.addDitherOffset(x + 2, y, weighError(error, 5, 48));
    pixelImage.addDitherOffset(x - 2, y + 1, weighError(error, 3, 48));
    pixelImage.addDitherOffset(x - 1, y + 1, weighError(error, 5, 48));
    pixelImage.addDitherOffset(x, y + 1, weighError(error, 7, 48));
    pixelImage.addDitherOffset(x + 1, y + 1, weighError(error, 5, 48));
    pixelImage.addDitherOffset(x + 2, y + 1, weighError(error, 3, 48));
    pixelImage.addDitherOffset(x - 2, y + 2, weighError(error, 1, 48));
    pixelImage.addDitherOffset(x - 1, y + 2, weighError(error, 3, 48));
    pixelImage.addDitherOffset(x, y + 2, weighError(error, 5, 48));
    pixelImage.addDitherOffset(x + 1, y + 2, weighError(error, 3, 48));
    pixelImage.addDitherOffset(x + 2, y + 2, weighError(error, 1, 48));
  }

  function atkinsonDither(pixelImage, x, y, error) {
    pixelImage.addDitherOffset(x + 1, y, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x + 2, y, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x - 1, y + 1, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x, y + 1, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x + 1, y + 1, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x, y + 2, weighError(error, 1, 8));
  }

  function convertToPixelImage(imageData, restrictedImage) {
      return new Remapper(restrictedImage).mapImageData(imageData); 
  }

  return {
    convertToPixelImage: convertToPixelImage,
    supportedGraphicModes: [{
      key: 'Multicolor',
      value: function() {
        var pixelImage = PixelImage.create(160, 200, undefined, 2, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(160, 200));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        return pixelImage;
      }
    }, {
      key: 'FLI',
      value: function() {
        var pixelImage = PixelImage.create(160, 200, undefined, 2, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(160, 200));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
        return pixelImage;
      }
    }, {
      key: 'AFLI',
      value: function() {
        var pixelImage = PixelImage.create(320, 200, undefined, 1, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 1));
        return pixelImage;
      }
    }, {
      key: 'Hires',
      value: function() {
        var pixelImage = PixelImage.create(320, 200, undefined, 1, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        return pixelImage;
      }
    }],
    // TODO: rewrite as an array
    getSupportedDithers: function() {
      return [{
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
      }];
    },
    supportedErrorDiffusionDithers: [{
      key: 'None',
      value: function() {}
    }, {
      key: 'Floyd-Steinberg',
      value: fsDither
    }, {
      key: 'Jarvis, Judice and Ninke',
      value: jjnDither
    }, {
      key: 'Atkinson',
      value: atkinsonDither
    }]
  };

});
