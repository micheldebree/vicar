/*global angular, URL, ColorMap, Remapper, PixelImage, ImageGrabber, PixelCalculator, Palette, KoalaExporter, KoalaPicture, FileReader */
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
        img.src = 'images/rainbowgirl.jpg';

        $scope.dithers = c64izerService.getSupportedDithers();
        $scope.selectedDither = $scope.dithers[3];
        $scope.$watch('selectedDither', function () {
            $scope.convert();
        });
        
        $scope.profiles = c64izerService.getSupportedProfiles();
        $scope.selectedProfile = $scope.profiles[0];
        $scope.$watch('selectedProfile', function () {
            $scope.convert();
        });
        
        $scope.selectDither = function (dither) {
            $scope.selectedDither = dither;
        };
        
        $scope.selectProfile = function (profile) {
            $scope.selectedProfile = profile;
        };
        
        $scope.imageChanged = function () {
            $scope.convert();
        };
        
        function toPixelImage(colorMap, palette) {
            var result = new PixelImage();
           
            result.setPalette(palette);
            result.setDither([[0]]);
            result.init(colorMap.width, colorMap.height);
            result.addColorMap(new ColorMap(colorMap.width, colorMap.height, 1, 1));
            result.drawImageData(colorMap.toImageData(palette));
           
            return result;
        }
        
        $scope.convert = function () {
            $scope.mainImage = undefined;
            // generate main image
            
            var grabber = new ImageGrabber(),
                palette = new Palette($scope.selectedProfile.value.palette),
                i,
                converter = new KoalaExporter(),
                koalaPic;
            
            function convertToPixelImage(imageData, pW, pH, colorMaps) {
                var w = imageData.width,
                    h = imageData.height,
                    unrestrictedImage = new PixelImage(),
                    restrictedImage,
                   
                    ci,
                    cm;
                   
                // create an unrestricted image (one colormap of 1 x 1 resolution).                 
                unrestrictedImage.setPalette(palette);
                unrestrictedImage.setPixelAspect(pW, pH);
                unrestrictedImage.init(w, h, new ColorMap(w, h, 1, 1));
                unrestrictedImage.drawImageData(imageData);
              
                
                 // create an image with the extracted color maps
                restrictedImage = new PixelImage();
                restrictedImage.setPixelAspect(pW, pH);
                restrictedImage.init(w, h);
                restrictedImage.setPalette(palette);
                
                $scope.colorMap = [];
                for (ci = 0; ci < colorMaps.length; ci += 1) {
                    cm = unrestrictedImage.extractColorMap(colorMaps[ci]);
                    restrictedImage.addColorMap(cm);
                    $scope.colorMap[ci] = toPixelImage(cm, palette);
                    $scope.colorMap[ci].setPixelAspect(pW, pH);
                }
      
                // draw the image again in the restricted image
                restrictedImage.drawImageData(imageData, true);
                
                $scope.mainImage = unrestrictedImage;
                $scope.testImage = restrictedImage;
                
                koalaPic = converter.convert($scope.testImage);
                $scope.mainImage = converter.toPixelImage(koalaPic, palette);
                
                
                $scope.$apply();
            }
            
            function convertTo2ColorHires(imageData) {
                var colorMaps = [],
                    w = imageData.width,
                    h = imageData.height;
            
                colorMaps.push(new ColorMap(w, h, w, h));
                colorMaps.push(new ColorMap(w, h, w, h));
                convertToPixelImage(imageData, 1, 1, colorMaps);
            }
            
            function convertToHires(imageData) {
                var  colorMaps = [],
                    w = imageData.width,
                    h = imageData.height;
            
                colorMaps.push(new ColorMap(w, h, 8, 8));
                colorMaps.push(new ColorMap(w, h, 8, 8));
                convertToPixelImage(imageData, 1, 1, colorMaps);
            }
            
            
            function convertToMultiColor(imageData) {
                var  colorMaps = [],
                    w = imageData.width,
                    h = imageData.height;
                
                colorMaps.push(new ColorMap(w, h));
                colorMaps.push(new ColorMap(w, h, 4, 8));
                colorMaps.push(new ColorMap(w, h, 4, 8));
                colorMaps.push(new ColorMap(w, h, 4, 8));
                convertToPixelImage(imageData, 2, 1, colorMaps);
            }
            
            grabber.grab(img, function (imageData) {
                convertToMultiColor(imageData);
                //convertToHires(imageData);
                //convertTo2ColorHires(imageData);
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