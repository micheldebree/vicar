/*global angular, Image, URL, ColorMap, PixelImage, ImageGrabber, KoalaPicture, peptoPalette */
/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
angular.module('vicarApp')
    .controller('MainCtrl', ['$scope', 'c64izerService', '$timeout', function ($scope, c64izerService, $timeout) {
        'use strict';

        var img = new Image();
        img.src = 'images/eye.jpg';

        function sleep(millis)
       {
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < millis);
      }
        // graphic mode selection
        $scope.graphicModes = c64izerService.supportedGraphicModes;
        $scope.selectedGraphicMode = $scope.graphicModes[0];
        $scope.$watch('selectedGraphicMode', function () {
            convert();
        });
        $scope.selectGraphicMode = function (graphicMode) {
            $scope.selectedGraphicMode = graphicMode;
        };

        // ordered dithering selection
        $scope.dithers = c64izerService.getSupportedDithers();
        $scope.selectedDither = $scope.dithers[2];

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
         */
        function convert () {

            var palette = peptoPalette,
                resultImage = $scope.selectedGraphicMode.value(),
                grabber = new ImageGrabber(img, resultImage.width, resultImage.height);

            $scope.mainImage = undefined;
            $scope.koalaDownloadLink = undefined;

            resultImage.palette = peptoPalette;

            function convertToPixelImage(imageData, restrictedImage) {
                var w = imageData.width,
                    h = imageData.height,
                    unrestrictedImage = new PixelImage(),
                    ci,
                    koalaPic,
                    converter = new KoalaPicture();


                // create an unrestricted image (one colormap of 1 x 1 resolution).
                // and map the image onto it.
                unrestrictedImage.palette = palette;
                unrestrictedImage.dither = $scope.selectedDither.value;
                unrestrictedImage.errorDiffusionDither = $scope.selectedErrorDiffusionDither.value;
                unrestrictedImage.pWidth = restrictedImage.pWidth;
                unrestrictedImage.pHeight = restrictedImage.pHeight;
                unrestrictedImage.init(w, h, new ColorMap(w, h, 1, 1));
                unrestrictedImage.drawImageData(imageData);

                // fill up the colormaps in the restricted image based based on the colors in the unrestricted image
                for (ci = 0; ci < restrictedImage.colorMaps.length; ci += 1) {
                    unrestrictedImage.extractColorMap(restrictedImage.colorMaps[ci]);
                }

                // draw the image again in the restricted image, making sure to use the same dithering
                // N.B. using a different dithering gives interesting results.
                restrictedImage.dither = unrestrictedImage.dither;
                restrictedImage.errorDiffusionDither = unrestrictedImage.errorDiffusionDither;
                restrictedImage.drawImageData(imageData);

                $scope.mainImage = restrictedImage;
                //$scope.testImage = unrestrictedImage;
                //$scope.quality = unrestrictedImage.getTransparencyPercentage();

                // convert to koalapic
                // TODO: do this on demand, when user actually wants to save a koala pic
                koalaPic = converter.convert(restrictedImage);
                $scope.mainImage = converter.toPixelImage(koalaPic, palette);
                $scope.koalaDownloadLink = koalaPic.toUrl();

            }

            $timeout(function() {grabber.grab(function (imageData) {
                convertToPixelImage(imageData, resultImage);
            }); }, 500);

        }

        function upload() {
            if ($scope.files !== undefined && $scope.files.length === 1) {

                img.src = URL.createObjectURL($scope.files[0]);
                img.onload = function () {
                    convert();
                };
            }
        }

        $scope.$watch('files', function () {
            upload();
        });

        convert();

    }]);
