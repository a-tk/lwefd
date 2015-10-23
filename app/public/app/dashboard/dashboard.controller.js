(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['DataService'];

  function DashboardCtrl(DataService) {
    /* jshint validthis: true */
    var vm = this;

    vm.getProducts = getProducts;
    vm.products = [];
    vm.selectedPost = undefined;
    vm.title = 'Products';

    activate();

    function activate() {
      getProducts();
    }

    function getProducts() {
      return DataService.getProducts()
        .then(function (products) {
          vm.products = products.data;
        });
    }

  }
})();