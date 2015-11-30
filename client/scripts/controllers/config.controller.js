(function () {
  'use strict';


  /**
   * @ngdoc function
   * @name lwefd.controller:ConfigCtrl
   * @description
   * # ConfigCtrl
   */
  angular.module('lwefd')
    .controller('ConfigCtrl', function ($scope, $http, $location, DbService) {
      var vm = this;
      vm.products = [];
      vm.activate = activate();
      vm.getProducts = getProducts;
      vm.addProduct = addProduct;
      vm.updateProductName = updateProductName;
      vm.deleteProduct = deleteProduct;
      vm.url = $location.host();

      function getProducts () {
        DbService.getProducts(function (result) {
          vm.products = result.data;
        });
      }

      function updateProductName (id, name) {
        DbService.updateProductName(id, name, function () {
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
        vm.url = $location.host();
        getProducts();
      }

      function errorWithStyle(err) {
        alert('err: ' + JSON.stringify(err));
      }
    });
})();
