/*global angular*/
angular
    .module('vicarApp', ['ngRoute', 'webcam'])
    .config(function ($routeProvider, $compileProvider) {
        'use strict';
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html'
                    //controller: 'MainCtrl'
            })
        .otherwise({
            redirectTo: '/'
        });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob|data):/);
    });
