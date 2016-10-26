/*global angular, Image, URL, ImageGrabber, PixelCalculator, PixelImage, ColorMap, KoalaPicture, Remapper, GraphicModes, ErrorDiffusionDitherer, OrderedDitherers */
angular.module('vicarApp')
    .controller('MainCtrl', [
        '$scope',
        function ($scope) {
            'use strict';

            // graphic mode selection
            $scope.graphicModes = GraphicModes.all;
            $scope.selectedGraphicMode = $scope.graphicModes[0];

            // ordered dithering selection
            $scope.dithers = OrderedDitherers.all;
            $scope.selectedDither = $scope.dithers[2];

            // error diffusion dithering selection
            $scope.errorDiffusionDithers = ErrorDiffusionDitherer.all;
            $scope.selectedErrorDiffusionDither = $scope.errorDiffusionDithers[0];

            // psychedelic mode selection
            $scope.psychedelicModes = [{
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
            }];
            $scope.selectedPsychedelicMode = $scope.psychedelicModes[0];

            (function () {
                var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                window.requestAnimationFrame = requestAnimationFrame;
            })();

            function paintOnCanvas(context, pixelImage) {

                var
                    imageData,
                    x,
                    y,
                    px,
                    py,
                    xx,
                    yy,
                    pixel;


                imageData = context.createImageData(pixelImage.width * pixelImage.pWidth, pixelImage.height * pixelImage.pHeight);

                for (x = 0; x < pixelImage.width; x += 1) {
                    for (y = 0; y < pixelImage.height; y += 1) {

                        pixel = pixelImage.peek(x, y);
                        for (px = 0; px < pixelImage.pWidth; px += 1) {
                            xx = x * pixelImage.pWidth + px;
                            yy = y * pixelImage.pHeight;
                            for (py = 0; py < pixelImage.pHeight; py += 1) {
                                PixelCalculator.poke(imageData, xx, yy + py, pixel);
                            }
                        }
                    }
                }
                context.putImageData(imageData, 0, 0);
            }

            function captureFrame() {
                var video = $scope.channel.video;
                var canvas = document.querySelector('#camvas');

                var ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, video.width / 2, video.height);

                var resultImage = $scope.selectedGraphicMode.value();
                resultImage.dither = $scope.selectedDither.value;
                resultImage.errorDiffusionDither = $scope.selectedErrorDiffusionDither.value;
                resultImage.mappingWeight = $scope.selectedPsychedelicMode.value;

                var imageData = ctx.getImageData(0, 0, resultImage.width, resultImage.height)

                new Remapper(resultImage).mapImageData(imageData);

                paintOnCanvas(ctx, resultImage);
                requestAnimationFrame(captureFrame);
            }

            $scope.onWebcam = function () {
                requestAnimationFrame(captureFrame);
            };
        }
    ]);
