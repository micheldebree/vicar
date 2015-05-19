/*global angular, URL, ColorMap, Remapper */
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
            
            image.grab(img, function () {
                
                $scope.mainImage = image;
                $scope.$apply();
                
                var remapper = new Remapper();
                remapper.setPalette($scope.selectedProfile.value.palette);
                
                
                $scope.mainImage = remapper.remap(image);
                
                $scope.$apply();
                
                
            }, 320);
            
            /*
            c64izerService.convert(
                img,
                $scope.selectedProfile.value,
                $scope.selectedDither.value,
                function (pixelImage) {
                    $scope.mainImage = pixelImage;
                    $scope.testImage4 = pixelImage.clone();
                    
                    var colorMap = new ColorMap(pixelImage.getWidth(), pixelImage.getHeight()),
                        colorMaps = [],
                        remapper = new Remapper();
//                    
                    colorMap.fromPixelImage(pixelImage);
                    colorMaps.push(colorMap);
//                    
                    $scope.testImage = colorMap.toPixelImage();
                    $scope.mainImage.subtract($scope.testImage);
//
                    colorMap = new ColorMap(8, 8);
                    colorMap.fromPixelImage(pixelImage);
                    colorMaps.push(colorMap);
                    $scope.testImage1 = colorMap.toPixelImage();
                    $scope.mainImage.subtract($scope.testImage1);
//                    
                    colorMap = new ColorMap(8, 8);
                    colorMap.fromPixelImage(pixelImage);
                  //colorMaps.push(colorMap);
                    $scope.testImage2 = colorMap.toPixelImage();
                    $scope.mainImage.subtract($scope.testImage2);
//                    
                    colorMap = new ColorMap(8, 8);
                    colorMap.fromPixelImage(pixelImage);
                  //colorMaps.push(colorMap);
                    $scope.testImage3 = colorMap.toPixelImage();
                    $scope.mainImage.subtract($scope.testImage3);

                    remapper.setColorMaps(colorMaps);
                    
                    //remapper.remap($scope.testImage4);
                    
                    $scope.$apply();
                }
            );
            */
            
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