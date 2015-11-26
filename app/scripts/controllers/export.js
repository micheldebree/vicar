/*global angular, KoalaPicture */
angular.module('vicarApp').controller('ExportCtrl', [
  '$scope', function ($scope) {

    'use strict';

    if ($scope.mainImage !== null) {
      var koala = KoalaPicture.fromPixelImage($scope.mainImage);
      $scope.koalaLink = koala.toObjectUrl();
    }

  }]);
/**/
