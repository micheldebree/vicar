/*global angular, Image, URL, ImageGrabber, PixelImage, ColorMap, KoalaPicture */
angular.module('vicarApp')
    .controller('MainCtrl', [
        '$scope',
        'c64izerService',
        function($scope, c64izerService) {
            'use strict';

            var img = new Image();
            img.src = 'images/eye.jpg';
            $scope.filename = 'eye';

            // graphic mode selection
            $scope.graphicModes = c64izerService.supportedGraphicModes;
            $scope.selectedGraphicMode = $scope.graphicModes[0];

            $scope.selectGraphicMode = function(graphicMode) {
                $scope.selectedGraphicMode = graphicMode;
                convert();
            };

            // ordered dithering selection
            $scope.dithers = c64izerService.getSupportedDithers();
            $scope.selectedDither = $scope.dithers[0];

            $scope.selectDither = function(dither) {
                $scope.selectedDither = dither;
                convert();
            };

            // error diffusion dithering selection
            $scope.errorDiffusionDithers = c64izerService.supportedErrorDiffusionDithers;
            $scope.selectedErrorDiffusionDither = $scope.errorDiffusionDithers[3];

            $scope.selectErrorDiffusionDither = function(errorDiffusionDither) {
                $scope.selectedErrorDiffusionDither = errorDiffusionDither;
                convert();
            };

            // psychedelic mode selection
            $scope.psychedelicModes = c64izerService.supportedPsychedelicModes;
            $scope.selectedPsychedelicMode = $scope.psychedelicModes[0];

            $scope.selectPsychedelicMode = function(psychedelicMode) {
                $scope.selectedPsychedelicMode = psychedelicMode;
                convert();
            };


            /**
             * Convert a ColorMap to a PixelImage, for debugging visualisation.
             */

            function toPixelImage(pixelImage, colorMapIndex) {
                var colorMap = pixelImage.colorMaps[colorMapIndex],
                    result = PixelImage.create(colorMap.width, colorMap.height,
                        new ColorMap(colorMap.width, colorMap.height, 1, 1), 1, 1);

                result.pWidth = pixelImage.pWidth;
                result.pHeight = pixelImage.pHeight;
                result.palette = pixelImage.palette;
                result.drawImageData(colorMap.toImageData(result.palette));
                return result;
            }

            /**
             * Convert the current Image to a PixelImage and update the scope.
             * @returns {void}
             */
            function convert() {

                var resultImage = $scope.selectedGraphicMode.value(),
                    grabber = new ImageGrabber(img, resultImage);

                $scope.mainImage = undefined;

                resultImage.dither = $scope.selectedDither.value;
                resultImage.errorDiffusionDither = $scope.selectedErrorDiffusionDither.value;
                resultImage.mappingWeight = $scope.selectedPsychedelicMode.value;

                grabber.grab(
                    function(imageData) {
                        $scope.$evalAsync(function() {
                            c64izerService.convertToPixelImage(imageData, resultImage);
                            $scope.mainImage = resultImage;
                            $scope.download = resultImage.toDownloadUrl();

                            // debug colorMaps
                            $scope.colorMap = [];
                            $scope.colorMap[0] = toPixelImage(resultImage, 0);
                            $scope.colorMap[1] = toPixelImage(resultImage, 1);
                            $scope.colorMap[2] = toPixelImage(resultImage, 2);
                            $scope.colorMap[3] = toPixelImage(resultImage, 3);
                            
                            if ($scope.selectedGraphicMode.key === 'Multicolor') {
                                // make a koala picture to download
                                $scope.koalaLink = KoalaPicture.fromPixelImage(resultImage).toUrl();
                            }
                            else {
                                $scope.koalaLink = undefined;
                            }

                            // debug koala conversion
                            // $scope.koala = KoalaPicture.toPixelImage(koala, resultImage.palette);

                        });
                    }
                );
            }

            $scope.upload = function(file) {
                $scope.filename = file.name;
                img.src = URL.createObjectURL(file);
                img.onload = function() {
                    $scope.$evalAsync(function() {
                        convert();
                    });
                };
            };

            convert();

        }
    ]);
