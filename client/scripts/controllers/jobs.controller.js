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
      vm.deleteJob = deleteJob;
      vm.deleteRun = deleteRun;

      function getProductName(pid) {
        DbService.getProductName(pid, function(result) {
          vm.name = result.name;
        }, fancyError);
      }

      function getJobs(id) {
        DbService.getJobs(id, function (result) {
          vm.jobs = result.data;
        }, fancyError);
      }

      function loadRuns (jobindex, id, force) {
        if (!force && vm.jobs[jobindex].hasOwnProperty('runsAlreadyLoaded')) {
          //console.log('not reloading runs for jid ' + id);
        } else {
          DbService.getRuns(vm.id, id, function (result) {
            vm.jobs[jobindex].runs = result.data;
            vm.jobs[jobindex].runsAlreadyLoaded = true;
          }, fancyError);
        }
      }

      function deleteJob(jid) {
        DbService.deleteJob(jid, function () {
          //niceMsg(msg);
          getJobs(vm.id);
        }, fancyError);
      }

      function deleteRun(jobindex, jid, rid) {
        DbService.deleteRun(rid, function () {
          loadRuns(jobindex, jid, true);
        }, fancyError);
      }

      function activate() {
        vm.id = $routeParams.id;
        getJobs(vm.id);
      }

      function fancyError(err) {
        alert(JSON.stringify(err));
      }

      function niceMsg(msg) {
        alert(msg);
      }
    });
})();
