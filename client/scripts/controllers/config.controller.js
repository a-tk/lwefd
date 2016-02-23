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
      vm.enableForwarding = enableForwarding;
      vm.disableForwarding = disableForwarding;
      vm.enablePinWriting = enablePinWriting;
      vm.disablePinWriting = disablePinWriting;
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

      function enableForwarding(pid, forwardUrl) {
        if (forwardUrl === null || forwardUrl == undefined) {
          errorWithStyle('must provide a URL');
        } else {
          DbService.setForwardUrl(pid, forwardUrl, function () {
            getProducts();
          }, errorWithStyle);
        }
      }

      function disableForwarding(pid) {
        DbService.setForwardUrl(pid, "", function () {
          getProducts();
        }, errorWithStyle);
      }

      function enablePinWriting(pid, relayMapping) {
        if (relayMapping === null || relayMapping == undefined) {
          errorWithStyle('must provide a pin mapping');
        } else if (!/^[0-9]+,(?=[0-9])[0-9]+$/i.test(relayMapping)) {
          errorWithStyle('Relay Map must be two comma separated numbers.')
        } else {
          DbService.setRelayNumbers(pid, relayMapping, function () {
            getProducts();
          }, errorWithStyle);
        }
      }

      function disablePinWriting (pid) {
        DbService.setRelayNumbers(pid, "", function () {
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
