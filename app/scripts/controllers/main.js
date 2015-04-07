/*global angular, URL, ColorMap */
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
            //quantizer = new Quantizer();
        img.src = 'images/rainbowgirl.jpg';
        
        $scope.thumbnails = [];

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
        
        function makeThumbnail(img, profile) {
            c64izerService.convert(
                img,
                profile.value,
                $scope.selectedDither.value,
                function (pixelImage) {
                    $scope.thumbnails.push(pixelImage);
                },
                320 / $scope.profiles.length
            );
        }
        
        $scope.imageChanged = function () {
            var i;
            $scope.thumbnails = [];
            $scope.convert();
            // generate thumbnails for all profiles
            for (i = 0; i < $scope.profiles.length; i += 1) {
                makeThumbnail(img, $scope.profiles[i]);
            }
        };
        
        $scope.convert = function () {
            $scope.mainImage = undefined;
            // generate main image
            c64izerService.convert(
                img,
                $scope.selectedProfile.value,
                $scope.selectedDither.value,
                function (pixelImage) {
                    $scope.mainImage = pixelImage;
                    
//                    var colorMap = new ColorMap(pixelImage, pixelImage.getWidth(), pixelImage.getHeight()),
//                        colorMaps = [];
//                    
//                    colorMaps.push(colorMap);
//                    
//                    $scope.testImage = colorMap.toPixelImage();
//                    $scope.mainImage.subtract($scope.testImage);
//
//                    colorMap = new ColorMap(pixelImage, 8, 8);
//                    colorMaps.push(colorMap);
//                    $scope.testImage1 = colorMap.toPixelImage();
//                    $scope.mainImage.subtract($scope.testImage1);
//                    
//                    colorMap = new ColorMap(pixelImage, 8, 8);
//                    colorMaps.push(colorMap);
//                    $scope.testImage2 = colorMap.toPixelImage();
//                    $scope.mainImage.subtract($scope.testImage2);
//                    
//                    colorMap = new ColorMap(pixelImage, 8, 8);
//                    colorMaps.push(colorMap);
//                    $scope.testImage3 = colorMap.toPixelImage();
//                    $scope.mainImage.subtract($scope.testImage3);
                    
                    
                    //$scope.testImage = quantizer.quantize(pixelImage, pixelImage.getWidth(), pixelImage.getHeight());
                    
                    //$scope.mainImage.subtract($scope.testImage);
                    
//                    $scope.testImage1 = quantizer.quantize($scope.mainImage, 8, 8);
//                    $scope.mainImage.subtract($scope.testImage1);
//                    $scope.testImage2 = quantizer.quantize($scope.mainImage, 8, 8);
//                    $scope.mainImage.subtract($scope.testImage2);
//                    $scope.testImage3 = quantizer.quantize($scope.mainImage, 8, 8);
//                    $scope.mainImage.subtract($scope.testImage3);
//                    
//                    $scope.testImage4 = new PixelImage();
//                    $scope.testImage4.init($scope.mainImage.getWidth(), $scope.mainImage.getHeight());
//                    
//                    $scope.testImage4.add($scope.testImage);
//                    $scope.testImage4.add($scope.testImage1);
//                    $scope.testImage4.add($scope.testImage2);
//                    $scope.testImage4.add($scope.testImage3);
//                    
                    $scope.$apply();
                }
            );
            
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