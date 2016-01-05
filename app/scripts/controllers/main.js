/*global angular, Image, URL, ImageGrabber, peptoPalette */
angular.module('vicarApp')
  .controller('MainCtrl', [
    '$scope',
    'c64izerService',
    function ($scope, c64izerService) {
      'use strict';

      var img = new Image();
      img.src = 'images/eye.jpg';
      $scope.filename = 'eye';

      // graphic mode selection
      $scope.graphicModes = c64izerService.supportedGraphicModes;
      $scope.selectedGraphicMode = $scope.graphicModes[0];

      $scope.selectGraphicMode = function (graphicMode) {
        $scope.selectedGraphicMode = graphicMode;
        convert();
      };

      // TODO: add graphics mode selection in future release
      // $scope.$watch('selectedGraphicMode', function () {
      //     convert();
      // });
      // $scope.selectGraphicMode = function (graphicMode) {
      //     $scope.selectedGraphicMode = graphicMode;
      // };

      // ordered dithering selection
      $scope.dithers = c64izerService.getSupportedDithers();
      $scope.selectedDither = $scope.dithers[0];

      $scope.selectDither = function (dither) {
        $scope.selectedDither = dither;
        convert();
      };

      // error diffusion dithering selection
      $scope.errorDiffusionDithers = c64izerService.supportedErrorDiffusionDithers;
      $scope.selectedErrorDiffusionDither = $scope.errorDiffusionDithers[3];

      $scope.selectErrorDiffusionDither = function (errorDiffusionDither) {
        $scope.selectedErrorDiffusionDither = errorDiffusionDither;
        convert();
      };

      /**
       * Convert a ColorMap to a PixelImage, for debugging visualisation.

      function toPixelImage(colorMap, palette) {
          var result = new PixelImage();
          result.palette = palette;
          result.dither = [[0]];
          result.init(colorMap.width, colorMap.height);
          result.addColorMap(new ColorMap(colorMap.width, colorMap.height, 1, 1));
          result.drawImageData(colorMap.toImageData(palette));
          return result;
      }
      */

      /**
       * Convert the current Image to a PixelImage and update the scope.
       * @returns {void}
       */
      function convert() {

        var resultImage = $scope.selectedGraphicMode.value(),
            grabber = new ImageGrabber(img, resultImage.width, resultImage.height);

        $scope.mainImage = undefined;

        resultImage.palette = peptoPalette;
        resultImage.dither = $scope.selectedDither.value;
        resultImage.errorDiffusionDither = $scope.selectedErrorDiffusionDither.value;

        grabber.grab(
          function (imageData) {
            $scope.$evalAsync(function () {
              c64izerService.convertToPixelImage(imageData, resultImage);
              $scope.mainImage = resultImage;
              $scope.download = resultImage.toDownloadUrl();
            });

          }
        );
      }

      $scope.upload = function (file) {
        $scope.filename = file.name;
        img.src = URL.createObjectURL(file);
        img.onload = function () {
          $scope.$evalAsync(function () {
            convert();
          });
        };
      };

      convert();

    }
  ]);
