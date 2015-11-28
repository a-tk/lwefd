(function () {
  'use strict';


  /**
   * @ngdoc function
   * @name lwefd.controller:ConfigCtrl
   * @description
   * # ConfigCtrl
   */
  angular.module('lwefd')
    .controller('ConfigCtrl', function ($scope, $http, DbService) {
      var vm = this;
      vm.products = [];
      vm.activate = activate();
      vm.getProducts = getProducts;
      vm.addProduct = addProduct;
      vm.updateProductName = updateProductName;
      vm.deleteProduct = deleteProduct;

      function getProducts () {
        DbService.getProducts(function (result) {
          vm.products = result.data;
        });
      }

      function updateProductName (id) {
        DbService.updateProductName(id, function () {
          getProducts();
        }, errorWithStyle);
      }

      function deleteProduct (id) {
        DbService.deleteProduct(id, function () {
          getProducts();
        }, errorWithStyle);
      }

      function addProduct(productName) {
        DbService.addProduct(productName, function () {
          getProducts();
        }, errorWithStyle);
      }

      function activate() {
        getProducts();
      }

      function errorWithStyle(err) {
        alert('err: ' + err);
      }
    });
})();
