(function () {
  'use strict';

  angular.module('app')
    .controller('TopNavCtrl', TopNavCtrl);

  TopNavCtrl.$inject = ['$route', '$location'];

  function TopNavCtrl($route, $location) {
    /* jshint validthis:true */
    var vm = this;

    vm.isRoute = isRoute;

    function isRoute(r) {
      return $location.path() === r;
    }
  }
})();