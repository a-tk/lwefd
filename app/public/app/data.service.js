(function () {
    'use strict';

    angular
        .module('app')
        .factory('DataService', DataService);

    DataService.$inject = ['$http'];

    function DataService($http) {
        var service = {
            getProduct: getProduct,
            getProducts: getProducts
        };

        return service;

        function getProducts() {
          return $http({method: 'GET', url: '/api/products'}).
            success(function(products, status, headers, config) {
              return products;

            }).error(function(data, status, headers, config) {
              return [];
            });
        }

        function getProduct(displayName) {
            return $http({method: 'GET', url: '/api/'+displayName}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
    }
})();