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
      vm.activate = activate;
      vm.getProducts = getProducts;

      function getProducts () {
        DbService.getProducts(function (result) {
          vm.products = result.data;
        });
      }

      function addProduct(productName) {
        DbService.addProduct(productName, function () {
          getProducts();
        });
      }

      function activate() {
        getProducts();
      }
    });
})();
