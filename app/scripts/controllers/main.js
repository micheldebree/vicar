/*global angular, C64izer, Palette, PeptoPalette, ViceRGBPalette, ViceRGBPALPalette, URL*/
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

        $scope.dithers = c64izerService.getSupportedDithers();
        $scope.selectedDither = $scope.dithers[2];
    
        $scope.palettes = c64izerService.getSupportedPalettes();
        $scope.selectedPalette = $scope.palettes[0];
    
        $scope.pixelWidths = c64izerService.getSupportedPixelWidths();
        $scope.selectedPixelWidth = $scope.pixelWidths[1];
        
        var img = new Image();
        img.src = 'images/rainbowgirl.jpg';
    
        $scope.convert = function () {
           
            var canvas = document.getElementById('Canvas0'),
                context = canvas.getContext('2d');
            
            // convert and draw the converted image data in the callback function
            c64izerService.convert(
                img,
                $scope.selectedPalette.value,
                $scope.selectedDither.value,
                $scope.selectedPixelWidth.value,
                function (pixelImage) {
                    canvas.width = pixelImage.getWidth();
                    canvas.height = pixelImage.getHeight();
                    context.putImageData(pixelImage.imageData, 0, 0);
                }
            );
        };
    
        $scope.upload = function () {
            if (typeof $scope.files !== 'undefined' && $scope.files.length === 1) {
                img.src = URL.createObjectURL($scope.files[0]);
                img.onload = function () {
                    $scope.convert();
                };
            }
            
        };
    
        $scope.$watch('files', function () {
            $scope.upload();
        });
    
        $scope.convert();
    
    }]);
