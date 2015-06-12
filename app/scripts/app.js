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
              .when('/koala', {
                templateUrl: 'views/koala.html',
                controller: 'KoalaCtrl'
            })
              .otherwise({
                redirectTo: '/'
            });
    });
