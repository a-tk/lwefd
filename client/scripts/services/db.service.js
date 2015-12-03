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
        getProductSummary: getProductSummary,
        updateProductName: updateProductName,
        deleteProduct: deleteProduct,
        deleteJob: deleteJob,
        deleteRun: deleteRun,
        getJobs: getJobs,
        getRuns: getRuns
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

      function getProductSummary(pid, callback, errorCallback) {
        $http.get('api/' + pid + '/summary').then(callback, errorCallback);
      }

      function updateProductName (id, name, callback, errorCallback) {
        $http.get('api/update/productName/' + id + '/' + name).then(callback, errorCallback);
      }

      function deleteProduct(id, callback, errorCallback) {
        $http.get('api/delete/product/' + id).then(callback, errorCallback);
      }

      function deleteJob(pid, jid, callback, errorCallback) {
        $http.get('api/' + pid + '/delete/job/' + jid).then(callback, errorCallback);
      }

      function deleteRun(id, callback, errorCallback) {
        $http.get('api/delete/run/' + id).then(callback, errorCallback);
      }

      function getJobs(id, callback, errorCallback) {
        $http.get('api/' + id + '/jobs').then(callback, errorCallback);
      }

      function getRuns(prodId, id, callback, errorCallback) {
        $http.get('api/' + prodId + '/jobs/' + id).then(callback, errorCallback);
      }
    });
})();
