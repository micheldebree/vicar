/*global angular, URL, ColorMap, Remapper, PixelImage */
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
            
            var image = new PixelImage();
            image.setPixelAspect(2, 1);
            
            image.grab(img, function () {
                
                $scope.mainImage = image;
                
                var remapper = new Remapper(),
                    secondImage;
               
                $scope.mainImage = remapper.remap(image, $scope.selectedProfile.value.palette);
                
                var cm = new ColorMap($scope.mainImage.getWidth(), $scope.mainImage.getHeight()),
                    cm1 =  new ColorMap($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), 4, 8),
                    cm2 =  new ColorMap($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), 4, 8),
                    cm3 =  new ColorMap($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), 4, 8);
              
                cm = $scope.mainImage.extractColorMap(cm);
                cm1 = $scope.mainImage.extractColorMap(cm1);
                cm2 = $scope.mainImage.extractColorMap(cm2);
                cm3 = $scope.mainImage.extractColorMap(cm3);
              
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
                //$scope.testImage.setPixelAspect(2, 1);
                $scope.testImage.addColorMap(cm);
                $scope.testImage.addColorMap(cm1);
                $scope.testImage.addColorMap(cm2);
                $scope.testImage.addColorMap(cm3);
                
                secondImage = PixelCalculator.getImageData(img, image.getWidth(), image.getHeight());
                $scope.testImage.drawImageData(secondImage, true);
                $scope.testImage.setPixelAspect(2, 1);
                
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