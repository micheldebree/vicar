/*global angular, C64izer, Palette, PeptoPalette, ViceRGBPalette, ViceRGBPALPalette, URL*/
/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
angular.module('vicarApp')
    .controller('MainCtrl', ['$scope', 'c64izer', function ($scope, c64izer) {
        'use strict';

        $scope.dithers = c64izer.getSupportedDithers();
        $scope.selectedDither = $scope.dithers[2];
    
        $scope.palettes = [{
            key: 'Pepto',
            value: new PeptoPalette()
        }, {
            key: 'Vice RGB',
            value: new ViceRGBPalette()
        }, {
            key: 'Vice RGB PAL',
            value: new ViceRGBPALPalette()
        }];
        $scope.selectedPalette = $scope.palettes[0];
    
        $scope.pixelWidths = [{
            key: '1:1',
            value: 1
        }, {
            key: '2:1',
            value: 2
        }];
        $scope.selectedPixelWidth = $scope.pixelWidths[1];
        
        var img = new Image();
        img.src = 'images/rainbowgirl.jpg';
    
        $scope.convert = function () {
           
            var canvas = document.getElementById('Canvas0'),
                context = canvas.getContext('2d');
            
            // convert and draw the converted image data in the callback function
            c64izer.convert(img, $scope.selectedPalette.value, $scope.selectedDither.value,  $scope.selectedPixelWidth.value,
                function (image) {
                    canvas.width = image.getWidth();
                    canvas.height = image.getHeight();
                    context.putImageData(image.imageData, 0, 0);
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
