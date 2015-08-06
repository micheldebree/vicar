/*global angular, FileReader, KoalaPicture, peptoPalette */
angular.module('vicarApp')
    .controller('KoalaCtrl', ['$scope', function ($scope) {

        'use strict';

        $scope.$watch('koalafile', function () {

            var exporter = new KoalaPicture(),
                reader = new FileReader();

            if (typeof $scope.koalafile !== 'undefined' && $scope.koalafile.length === 1) {

                reader.onload = function () {

                    var pic = new KoalaPicture();

                    // read the koala pic from array buffer
                    pic.read(reader.result);

                    // convert the pic to a pixelimage
                    $scope.koalaImage = exporter.toPixelImage(pic, peptoPalette);

                    $scope.koalaImage.setPixelIndex(0);

                    $scope.$apply();

                };

                reader.readAsArrayBuffer($scope.koalafile[0]);

            }


        });


    }]);
