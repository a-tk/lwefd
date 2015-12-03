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
      vm.name = vm.id;
      vm.numSuccess=0;
      vm.numUnstable=0;
      vm.numFailed=0;
      vm.numTotal = 0;
      vm.loadRuns = loadRuns;
      vm.deleteJob = deleteJob;
      vm.deleteRun = deleteRun;

      function getProductSummary() {
        DbService.getProductSummary(vm.id, function(result) {
          //console.log(JSON.stringify(result.data));
          vm.name = result.data.name;
          vm.numSuccess = result.data.numSuccess;
          vm.numUnstable = result.data.numUnstable;
          vm.numFailed = result.data.numFailed;
          vm.numTotal = vm.numSuccess + vm.numUnstable + vm.numFailed;
        }, fancyError);
      }

      function getJobs(id) {
        DbService.getJobs(id, function (result) {
          vm.jobs = result.data;
          getProductSummary();
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
        DbService.deleteJob(vm.id, jid, function () {
          //niceMsg(msg);
          getJobs(vm.id);
        }, fancyError);
      }

      function deleteRun(jobindex, jid, rid) {
        DbService.deleteRun(jid, rid, function () {
          loadRuns(jobindex, jid, true);
          getJobs(vm.id);
        }, fancyError);
      }

      function activate() {
        vm.id = $routeParams.id;
        getProductSummary();
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
