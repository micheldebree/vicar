/*global $http */
angular.module('vicarApp').factory('binaryResourceService', [$http, function ($http) {
  'use strict';

  function getData(url) {
    delete $http.defaults.headers.common['X-Requested-With']; // See note 2
    return $http.get(url, {
      responseType: 'arraybuffer'
    });
  }

  return {
    getData: getData
  };

}]);
