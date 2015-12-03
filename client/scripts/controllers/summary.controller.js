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
          for (var i = 0; i < vm.products.length; i++) {
            vm.products[i].timeDifference = Date.now() - vm.products[i].lastSuccess;
          }
        });
      }

      function activate() {
        getProducts();
      }
    })
    .filter('millisecondsToTime', function () {
      return function(duration) {
          var seconds = parseInt((duration/1000)%60)
          , minutes = parseInt((duration/(1000*60))%60)
          , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
      }
    });
})();
