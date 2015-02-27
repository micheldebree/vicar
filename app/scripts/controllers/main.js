/*global angular, C64izer, Palette, PeptoPalette, ViceRGBPalette, ViceRGBPALPalette, URL*/
/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
angular.module('vicarApp')
    .controller('MainCtrl', function ($scope) {
        'use strict';
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.converter = new C64izer();
        $scope.dithers = $scope.converter.remapper.dithers;
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
    
        var img = new Image();
        img.src = 'images/rainbowgirl.jpg';
       
    
        $scope.convert = function () {
           
            var canvas = document.getElementById('Canvas0'),
                context = canvas.getContext('2d');

             // set the palette
            $scope.converter.remapper.palette = $scope.selectedPalette.value;
            
            // set the ordered dithering algorithm
            $scope.converter.remapper.dither = $scope.selectedDither.value;
            
            // convert and draw the converted image data in the callback function
            $scope.converter.convert(img,
                function () {
                    context.putImageData($scope.converter.image.imageData, 0, 0);
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
    
    });
