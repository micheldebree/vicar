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
        img.src = 'images/girl-face.jpg';

        // graphic mode selection
        $scope.graphicModes = c64izerService.supportedGraphicModes;
        $scope.selectedGraphicMode = $scope.graphicModes[0];
        $scope.$watch('selectedGraphicMode', function () {
            $scope.convert();
        });
        $scope.selectGraphicMode = function (graphicMode) {
            $scope.selectedGraphicMode = graphicMode;
        };

        $scope.render = function () {
            $scope.mainImage = undefined;
            $timeout(function() {$scope.convert();});
        };


        // ordered dithering selection
        $scope.dithers = c64izerService.getSupportedDithers();
        $scope.selectedDither = $scope.dithers[2];

        $scope.selectDither = function (dither) {
            $scope.selectedDither = dither;
            $scope.render();
        };

        // error diffusion dithering selection
        $scope.errorDiffusionDithers = c64izerService.supportedErrorDiffusionDithers;
        $scope.selectedErrorDiffusionDither = $scope.errorDiffusionDithers[3];

        $scope.selectErrorDiffusionDither = function (errorDiffusionDither) {
            $scope.selectedErrorDiffusionDither = errorDiffusionDither;
            $scope.render();
        };

        function toPixelImage(colorMap, palette) {
            var result = new PixelImage();
            result.palette = palette;
            result.dither = [[0]];
            result.init(colorMap.width, colorMap.height);
            result.addColorMap(new ColorMap(colorMap.width, colorMap.height, 1, 1));
            result.drawImageData(colorMap.toImageData(palette));
            return result;
        }

        $scope.convert = function () {
            $scope.mainImage = undefined;
            // generate main image

            var palette = peptoPalette,
                resultImage = $scope.selectedGraphicMode.value(),
                grabber = new ImageGrabber(img, resultImage.width, resultImage.height);

            resultImage.palette = peptoPalette;

            function convertToPixelImage(imageData, restrictedImage) {
                var w = imageData.width,
                    h = imageData.height,
                    unrestrictedImage = new PixelImage(),
                    ci,
                    cm,
                    koalaPic,
                    converter = new KoalaPicture();


                // create an unrestricted image (one colormap of 1 x 1 resolution).
                unrestrictedImage.palette = palette;
                unrestrictedImage.dither = $scope.selectedDither.value;
                unrestrictedImage.errorDiffusionDither = $scope.selectedErrorDiffusionDither.value;
                unrestrictedImage.pWidth = restrictedImage.pWidth;
                unrestrictedImage.pHeight = restrictedImage.pHeight;
                unrestrictedImage.init(w, h, new ColorMap(w, h, 1, 1));
                unrestrictedImage.drawImageData(imageData);

                $scope.colorMap = [];
                for (ci = 0; ci < restrictedImage.colorMaps.length; ci += 1) {
                    cm = unrestrictedImage.extractColorMap(restrictedImage.colorMaps[ci]);
                    $scope.colorMap[ci] = toPixelImage(cm, palette);
                    $scope.colorMap[ci].pWidth = restrictedImage.pWidth;
                    $scope.colorMap[ci].pHeight = restrictedImage.pHeight;
                }

                // draw the image again in the restricted image
                restrictedImage.dither = unrestrictedImage.dither;
                restrictedImage.errorDiffusionDither = unrestrictedImage.errorDiffusionDither;
                restrictedImage.drawImageData(imageData);

                $scope.mainImage = restrictedImage;
                $scope.testImage = unrestrictedImage;
                $scope.quality = unrestrictedImage.getTransparencyPercentage();

                //koalaPic = converter.convert(restrictedImage);
                //$scope.mainImage = converter.toPixelImage(koalaPic, palette);
                //$scope.koalaDownloadLink = koalaPic.toUrl();

            }

            grabber.grab(function (imageData) {
                convertToPixelImage(imageData, resultImage);
            });

        };

        $scope.upload = function () {
            if ($scope.files !== undefined && $scope.files.length === 1) {
                img.src = URL.createObjectURL($scope.files[0]);
                img.onload = function () {
                    $scope.render();
                };
            }
        };

        $scope.$watch('files', function () {
            $scope.upload();
        });

        $scope.render();

    }]);
