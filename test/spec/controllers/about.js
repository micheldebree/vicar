/*global module, describe, beforeEach, inject, it, expect*/
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

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
