/*global angular, Image, URL, ImageGrabber, PixelCalculator, PixelImage, ColorMap, KoalaPicture, Remapper, GraphicModes, ErrorDiffusionDitherer, OrderedDitherers */
angular.module('vicarApp')
    .controller('MainCtrl', [
        '$scope',
        function($scope) {
            'use strict';

            (function() {
                var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                window.requestAnimationFrame = requestAnimationFrame;
            })();

            var canvas = document.querySelector('#camvas'),
                ctx = canvas.getContext('2d'),
                psychedelicModes = [{
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

            function paintOnCanvas(context, pixelImage) {
                var px,
                    py,
                    xx,
                    yy,
                    pixel,
                    imageData = context.createImageData(pixelImage.width * pixelImage.pWidth, pixelImage.height * pixelImage.pHeight);

                for (var x = 0; x < pixelImage.width; x += 1) {
                    for (var y = 0; y < pixelImage.height; y += 1) {
                        pixel = pixelImage.peek(x, y);
                        xx = x * pixelImage.pWidth;
                        for (px = 0; px < pixelImage.pWidth; px += 1) {
                            yy = y * pixelImage.pHeight;
                            for (py = 0; py < pixelImage.pHeight; py += 1) {
                                PixelCalculator.poke(imageData, xx + px, yy + py, pixel);
                            }
                        }
                    }
                }
                context.putImageData(imageData, 0, 0);
            }

            function captureFrame() {
                var video = $scope.channel.video;

                // resultImage.clear();
                var resultImage = GraphicModes.c64Multicolor();
                resultImage.dither = OrderedDitherers.all[2].value;
                // resultImage.errorDiffusionDither = ErrorDiffusionDitherer.fsDither;
                resultImage.mappingWeight = psychedelicModes[1].value;

                ctx.drawImage(video, 0, 0, video.width / resultImage.pWidth, video.height / resultImage.pHeight);
                var imageData = ctx.getImageData(0, 0, resultImage.width, resultImage.height);

                Remapper.mapImageData(imageData, resultImage);

                paintOnCanvas(ctx, resultImage);
                requestAnimationFrame(captureFrame);
            }

            $scope.onWebcam = function() {
                requestAnimationFrame(captureFrame);
            };
        }
    ]);
