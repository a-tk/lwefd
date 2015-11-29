(function () {
  'use strict';


  /**
   * @ngdoc function
   * @name lwefd.controller:NavCtrl
   * @description
   * # NavCtrl
   */
  angular.module('lwefd')
    .controller('NavCtrl', function ($scope, DbService) {
      var vm = this;
      vm.activate = activate();
      vm.products = [];
      vm.getProducts = getProducts;

      function activate() {
        getProducts();
      }

      function getProducts () {
        DbService.getProducts(function (result) {
          vm.products = result.data;
        });
      }
    });
})();
