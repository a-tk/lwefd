(function () {
  'use strict';


  /**
   * @ngdoc function
   * @name lwefd.controller:SummaryCtrl
   * @description
   * # SummaryCtrl
   * Controller of the lwefd summary
   */
  angular.module('lwefd')
    .controller('SummaryCtrl', function ($scope, $http, DbService) {
      var vm = this;
      vm.products = [];
      vm.activate = activate();
      vm.getProducts = getProducts;

      function getProducts () {
        DbService.getProducts(function (result) {
          vm.products = result.data;
          //console.log(vm.products);
        });
      }

      function activate() {
        getProducts();
      }
    });
})();
