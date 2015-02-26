/*global angular */
/**
 * @ngdoc function
 * @name vicarApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the vicarApp
 */
angular.module('vicarApp')
      .controller('AboutCtrl', function ($scope) {
        'use strict';
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });
