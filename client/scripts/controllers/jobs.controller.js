(function () {
  'use strict';


  /**
   * @ngdoc function
   * @name lwefd.controller:JobsCtrl
   * @description
   * # JobsCtrl
   */
  angular.module('lwefd')
    .controller('JobsCtrl', function ($scope, $routeParams, DbService) {
      var vm = this;
      vm.activate = activate();
      vm.jobs = [];
      vm.id = $routeParams.id;

      $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $('.collapse').on('show.bs.collapse', function () {
          $('.collapse.in').collapse('hide');
        });
      });

      function getJobs(id) {
        DbService.getJobs(id, function (result) {
          vm.jobs = result.data;
        }, function (err) {
          alert(JSON.stringify(err));
        });
      }

      function activate() {
        vm.id = $routeParams.id;
        getJobs(vm.id);
      }
    });
})();
