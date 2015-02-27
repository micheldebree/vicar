/*global angular*/
/**
 * @ngdoc overview
 * @name workspaceApp
 * @description
 * # workspaceApp
 *
 * Main module of the application.
 */
angular
      .module('vicarApp', [
       
        'ngRoute',
       
        'angularFileUpload'
    ])
      .config(function ($routeProvider) {
        'use strict';
    
        $routeProvider
              .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
              .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
              .otherwise({
                redirectTo: '/'
            });
    });
