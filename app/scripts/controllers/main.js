/*global angular, URL*/
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
        $scope.selectedDither = $scope.dithers[3];

        $scope.profiles = c64izerService.getSupportedProfiles();
        $scope.selectedProfile = $scope.profiles[0];
        
        var img = new Image();
        img.src = 'images/rainbowgirl.jpg';
    
        $scope.convert = function () {
           
            var canvas = document.getElementById('Canvas0'),
                context = canvas.getContext('2d');
            
            c64izerService.convert(
                img,
                $scope.selectedProfile.value,
                $scope.selectedDither.value,
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
