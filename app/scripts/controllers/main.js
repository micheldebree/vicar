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
                $scope.$apply();
                
                var remapper = new Remapper(),
                    secondImage;
               
                $scope.mainImage = remapper.remap(image, $scope.selectedProfile.value.palette);
                
                var cm = new ColorMap($scope.mainImage.getWidth(), $scope.mainImage.getHeight()),
                    cm1 =  new ColorMap($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), 4, 8),
                    cm2 =  new ColorMap($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), 4, 8),
                    cm3 =  new ColorMap($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), 4, 8);
                
                var pimage = new PixelImage(),
                    pimage1 = new PixelImage(),
                    pimage2 = new PixelImage(),
                    pimage3 = new PixelImage();
                
                pimage.init($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), cm);
                pimage1.init($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), cm1);
                pimage2.init($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), cm2);
                pimage3.init($scope.mainImage.getWidth(), $scope.mainImage.getHeight(), cm3);
                pimage = $scope.mainImage.extractColorMap(pimage);
                pimage1 = $scope.mainImage.extractColorMap(pimage1);
                pimage2 = $scope.mainImage.extractColorMap(pimage2);
                pimage3 = $scope.mainImage.extractColorMap(pimage3);
                
                $scope.testImage = pimage;
                $scope.testImage1 = pimage1;
                $scope.testImage2 = pimage2;
                $scope.testImage3 = pimage3;
                
                $scope.testImage3.merge($scope.testImage2);
                $scope.testImage3.merge($scope.testImage1);
                $scope.testImage3.merge($scope.testImage);
               
              
                
                
                secondImage = PixelCalculator.getImageData(img, image.getWidth(), image.getHeight());
                
                $scope.testImage3.setDither([
        [1, 49, 13, 61, 4, 52, 16, 64],
        [33, 17, 45, 29, 36, 20, 48, 31],
        [9, 57, 5, 53, 12, 60, 8, 56],
        [41, 25, 37, 21, 44, 28, 40, 24],
        [3, 51, 15, 63, 2, 50, 14, 62],
        [35, 19, 47, 31, 34, 18, 46, 30],
        [11, 59, 7, 55, 10, 58, 6, 54],
        [43, 27, 39, 23, 42, 26, 38, 22]]);
                
                $scope.testImage3.drawImageData(secondImage, true);
                $scope.testImage3.setPixelAspect(2, 1);
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