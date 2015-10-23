(function () {
  'use strict';

  angular
    .module('app')
    .controller('ConfigureCtrl', ConfigureCtrl);

  ConfigureCtrl.$inject = ['DataService'];

  function ConfigureCtrl(DataService) {

    var vm = this;
    vm.addProduct = addProduct;
    vm.testNotification = testNotification;

    activate();

    function activate() {

    }

    function addProduct() {

    }

    function testNotification() {

    }
  }
})();