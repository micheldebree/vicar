/*global angular */
/**
 * @ngdoc function
 * @name workspaceApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the workspaceApp
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
