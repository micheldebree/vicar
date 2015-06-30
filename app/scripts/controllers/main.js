/*global angular, URL, ColorMap, PixelImage, ImageGrabber, Palette, KoalaPicture, peptoPalette, GraphicModes */
/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
angular.module('vicarApp')
    .controller('MainCtrl', ['$scope', 'c64izerService', function ($scope, c64izerService) {
        'use strict';
        
        var img = new Image();
        img.src = 'images/girl-face.jpg';

        $scope.dithers = c64izerService.getSupportedDithers();
        $scope.selectedDither = $scope.dithers[3];
        $scope.$watch('selectedDither', function () {
            $scope.convert();
        });
        
        $scope.selectDither = function (dither) {
            $scope.selectedDither = dither;
        };
        
     
        $scope.imageChanged = function () {
            $scope.convert();
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
                converter = new KoalaPicture(),
                koalaPic,
                resultImage = GraphicModes.Multicolor(),
                grabber = new ImageGrabber(img, resultImage.width, resultImage.height);
                
            resultImage.palette = peptoPalette;
            
            function convertToPixelImage(imageData, restrictedImage) {
                var w = imageData.width,
                    h = imageData.height,
                    unrestrictedImage = new PixelImage(),
                    ci,
                    cm;
                   
                // create an unrestricted image (one colormap of 1 x 1 resolution).
                unrestrictedImage.palette = palette;
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
                restrictedImage.drawImageData(imageData);
                
                $scope.mainImage = restrictedImage;
                $scope.testImage = unrestrictedImage;
                $scope.quality = unrestrictedImage.getTransparencyPercentage();
                
                koalaPic = converter.convert(restrictedImage);
                $scope.mainImage = converter.toPixelImage(koalaPic, palette);
                $scope.koalaDownloadLink = koalaPic.toUrl();
                
                $scope.$apply();
            }
            
            grabber.grab(function (imageData) {
                convertToPixelImage(imageData, resultImage);
            });
          
            
        };

        $scope.upload = function () {
            if (typeof $scope.files !== 'undefined' && $scope.files.length === 1) {
                img.src = URL.createObjectURL($scope.files[0]);
                img.onload = function () {
                    $scope.imageChanged();
                };
            }
        };

        $scope.$watch('files', function () {
            $scope.upload();
        });
        
      
        $scope.imageChanged();

    }]);