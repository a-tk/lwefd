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
      vm.loadRuns = loadRuns;

      function getJobs(id) {
        DbService.getJobs(id, function (result) {
          vm.jobs = result.data;
        }, function (err) {
          alert(JSON.stringify(err));
        });
      }

      function loadRuns (jobindex, id, force) {
        if (!force && vm.jobs[jobindex].hasOwnProperty('runsAlreadyLoaded')) {
          //console.log('not reloading runs for jid ' + id);
        } else {
          DbService.getRuns(vm.id, id, function (result) {
            vm.jobs[jobindex].runs = result.data;
            vm.jobs[jobindex].runsAlreadyLoaded = true;
          }, function (err) {
            alert(JSON.stringify(err));
          });
        }
      }

      function activate() {
        vm.id = $routeParams.id;
        getJobs(vm.id);
      }
    });
})();
