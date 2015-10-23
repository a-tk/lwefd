(function () {
  'use strict';

  angular
    .module('app')
    .factory('DataService', DataService);

  DataService.$inject = ['$http'];

  function DataService($http) {
    var service = {
      getProduct: getProduct,
      getProducts: getProducts,
      addProduct: addProduct,
      testNotify: testNotify,
      getJobs: getJobs,
      getRuns: getRuns
    };

    return service;

    function getProducts() {
      return $http({method: 'GET', url: '/api/products'}).
        success(function (data, status, headers, config) {
          return data;

        }).error(function (data, status, headers, config) {
          return [];
        });
    }

    //TODO: need api backend call for this
    function getProduct(productId) {
      return $http({method: 'GET', url: '/api/' + productId}).
        success(function (data, status, headers, config) {
          return data;
        }).
        error(function (data, status, headers, config) {
        });
    }


    //TODO:
    function addProduct(name) {
      return $http({method: 'POST', url: '/api/create/' + name}).
        success(function (data, status, headers, config) {
          return data;
        }).
        error(function (data, status, headers, config) {
        });
    }

    function testNotify(productId, status) {
      return $http({method: 'POST', url: '/api/' + productId + '/notify/'}).
        success(function (data, status, headers, config) {
          return data;
        }).
        error(function (data, status, headers, config) {
        });
    }

    function getJobs(productId) {
      return $http({method: 'GET', url: '/api/' + productId + '/jobs/'}).
        success(function (data, status, headers, config) {
          return data;
        }).
        error(function (data, status, headers, config) {
        });
    }

    function getRuns(productId, jobId) {
      return $http({method: 'GET', url: '/api/' + productId + '/jobs/' + jobId}).
        success(function (data, status, headers, config) {
          return data;
        }).
        error(function (data, status, headers, config) {
        });
    }
  }
})();