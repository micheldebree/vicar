/*global module, describe, beforeEach, inject  */
describe('Controller: AboutCtrl', function () {
    'use strict';

      // load the controller's module
    beforeEach(module('vicarApp'));

    var AboutCtrl,
        scope;

      // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AboutCtrl = $controller('AboutCtrl', {
            $scope: scope
        });
    }));

   
});
