/*global angular*/
angular
      .module('vicarApp', ['ngRoute','ngFileUpload', 'webcam'])
      .config(function ($routeProvider, $compileProvider) {
        'use strict';

        $routeProvider
              .when('/', {
                templateUrl: 'views/main.html'
                //controller: 'MainCtrl'
            })
              .when('/koala', {
                templateUrl: 'views/koala.html',
                controller: 'KoalaCtrl'
            })
              .when('/settings', {
                templateUrl: 'views/settings.html'
            })
              .when('/debug', {
                templateUrl: 'views/debug.html'
            })
              .otherwise({
                redirectTo: '/'
            });

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob|data):/);

    });
