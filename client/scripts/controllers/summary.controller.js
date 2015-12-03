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
      vm.timeSinceSuccess = timeSinceSuccess;

      function timeSinceSuccess (index) {
        return Date.now() - vm.products[index].lastSuccess;
      }

      function getProducts () {
        DbService.getProducts(function (result) {
          vm.products = result.data;
        });
      }

      function activate() {
        getProducts();
      }
    })
    .filter('millisecondsToTime', function () {
      return function(millseconds) {
        var seconds = Math.floor(millseconds / 1000);
        var days = Math.floor(seconds / 86400);
        var hours = Math.floor((seconds % 86400) / 3600);
        var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var timeString = '';
        if(days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
        if(hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
        if(minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
        return timeString;
      }
    });
})();
