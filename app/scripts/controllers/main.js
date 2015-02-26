/*global angular, C64izer, Palette, PeptoPalette, ViceRGBPalette, ViceRGBPALPalette*/
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
       
        $scope.dithers = Palette.dithers;
        $scope.selectedDither = $scope.dithers[0];
    
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
        $scope.imageUrl = 'images/hqdefault.jpg';
        $scope.converter = new C64izer();
    
        $scope.convert = function () {
           
            var canvas = document.getElementById('Canvas0'),
                context = canvas.getContext('2d');

             // set the palette
            $scope.converter.palette = $scope.selectedPalette.value;
            
            // set the ordered dithering algorithm
            $scope.converter.palette.dither = $scope.selectedDither.value;

            img.src = $scope.imageUrl;
            
            // convert and draw the converted image data in the callback function
            $scope.converter.convert(img,
                function () {
                    context.putImageData($scope.converter.image.imageData, 0, 0);
                }
                );
        };
    
        $scope.convert();
    
    });
