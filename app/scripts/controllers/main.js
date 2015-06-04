/*global angular, URL, ColorMap, Remapper, PixelImage, ImageGrabber, PixelCalculator */
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
            var i;
            $scope.convert();
        };
        
        $scope.convert = function () {
            $scope.mainImage = undefined;
            // generate main image
            
            var grabber = new ImageGrabber();
            
            grabber.grab(img, function (imageData) {
                
                var remapper = new Remapper(),
                    secondImage,
                    image = remapper.remap(imageData, $scope.selectedProfile.value.palette, 2, 1);
                
                var cm = new ColorMap(image.getWidth(), image.getHeight()),
                    cm1 =  new ColorMap(image.getWidth(), image.getHeight(), 4, 8),
                    cm2 =  new ColorMap(image.getWidth(), image.getHeight(), 4, 8),
                    cm3 =  new ColorMap(image.getWidth(), image.getHeight(), 4, 8);
              
                cm = image.extractColorMap(cm);
                cm1 = image.extractColorMap(cm1);
                cm2 = image.extractColorMap(cm2);
                cm3 = image.extractColorMap(cm3);
              
                $scope.colorMap0 = new PixelImage();
                $scope.colorMap0.init(image.getWidth(), image.getHeight());
                $scope.colorMap0.addColorMap(new ColorMap(image.getWidth(), image.getHeight(), 1, 1));
                $scope.colorMap0.drawImageData(cm.toImageData());
                
                $scope.colorMap1 = new PixelImage();
                $scope.colorMap1.init(image.getWidth(), image.getHeight());
                $scope.colorMap1.addColorMap(new ColorMap(image.getWidth(), image.getHeight(), 1, 1));
                $scope.colorMap1.drawImageData(cm1.toImageData());
                
                $scope.colorMap2 = new PixelImage();
                $scope.colorMap2.init(image.getWidth(), image.getHeight());
                $scope.colorMap2.addColorMap(new ColorMap(image.getWidth(), image.getHeight(), 1, 1));
                $scope.colorMap2.drawImageData(cm2.toImageData());
                
                $scope.colorMap3 = new PixelImage();
                $scope.colorMap3.init(image.getWidth(), image.getHeight());
                $scope.colorMap3.addColorMap(new ColorMap(image.getWidth(), image.getHeight(), 1, 1));
                $scope.colorMap3.drawImageData(cm3.toImageData());
                
                
                $scope.testImage = new PixelImage();
                $scope.testImage.init(image.getWidth(), image.getHeight());
               
                $scope.testImage.addColorMap(cm);
                $scope.testImage.addColorMap(cm1);
                $scope.testImage.addColorMap(cm2);
                $scope.testImage.addColorMap(cm3);
                
                secondImage = PixelCalculator.getImageData(img, image.getWidth(), image.getHeight());
               
                $scope.testImage.drawImageData(secondImage, true);
                $scope.testImage.setPixelAspect(2, 1);
                
                $scope.mainImage = image;
                $scope.$apply();
                
                
            }, 320);
          
            
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