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
        getProducts: getProducts
      };

      return DbService;

      function addProduct(productName, callback) {
        $http.get('api/create/' + productName).then(callback,
        function (err) {
          console.log(err);
        });
      }

      function getProducts(callback) {
        $http.get('api/getProducts').then(callback,
        function (err) {
          console.log(err);
        });
      }
    });
})();
