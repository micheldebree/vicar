/*global angular*/
angular.module('vicarApp').directive('pixelImage', function () {
    'use strict';

    function link(scope, element) {

        scope.$watch(
            function () {
                return scope.pixelImage;
            },
            function () {
                if (scope.pixelImage !== undefined) {
                    element.attr('src', scope.pixelImage.toSrcUrl());
                } else {
                    element.attr('src', 'images/spiffygif_30x30.gif');
                }
            }
        );
    }

    return {
        scope: {
            pixelImage: '='
        },
        link: link
    };
});
