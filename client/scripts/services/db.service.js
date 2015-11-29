(function () {
  'use strict';


  /**
   * @ngdoc service
   * @name lwefd.DbService
   * @description
   * # BlogModel
   * Service in the simpleBlogApp.
   */
  angular.module('lwefd')
    .service('DbService', function ($http) {
      var DbService = {
        addProduct: addProduct,
        getProducts: getProducts,
        updateProductName: updateProductName,
        deleteProduct: deleteProduct,
        getJobs: getJobs
      };

      return DbService;

      function addProduct(productName, callback, errorCallback) {
        $http.get('api/create/' + productName).then(callback, errorCallback);
      }

      function getProducts(callback) {
        $http.get('api/getProducts').then(callback,
        function (err) {
          console.log(err);
        });
      }

      function updateProductName (id, name, callback, errorCallback) {
        $http.get('api/update/productName/' + id + '/' + name).then(callback, errorCallback);
      }

      function deleteProduct(id, callback, errorCallback) {
        $http.get('api/delete/product/' + id).then(callback, errorCallback);
      }

      function getJobs(id, callback, errorCallback) {
        $http.get('api/' + id + '/jobs').then(callback, errorCallback);
      }
    });
})();
