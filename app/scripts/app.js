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
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
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
