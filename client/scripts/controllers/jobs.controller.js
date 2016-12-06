(function () {
  'use strict';


  /**
   * @ngdoc function
   * @name lwefd.controller:JobsCtrl
   * @description
   * # JobsCtrl
   */
  angular.module('lwefd')
    .controller('JobsCtrl', function ($scope, $routeParams, $filter,  DbService, ChartService) {
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
      vm.setControlLimits = setControlLimits;

      vm.jobOrderBy = jobOrderBy;

      var defaultRunLimit = 15;

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

          for (var i = 0; i <  vm.jobs.length; i++) {
            //Set the default number of runs that are loaded.
            vm.jobs[i].runLimit = defaultRunLimit;
            vm.jobs[i].beginSelectionDate = undefined;
            vm.jobs[i].endSelectionDate = undefined;

          }

          getProductSummary();
        }, fancyError);
      }

      function loadRuns (jobindex, id, force) {
        if (!force && vm.jobs[jobindex].hasOwnProperty('runsAlreadyLoaded')) {
          //console.log('not reloading runs for jid ' + id);
        } else {

          var limit = vm.jobs[jobindex].runLimit;
          var beginSelectionDate = null;
          var endSelectionDate = null;

          //Annoyingly, the html5 input type of date can be either undefined or null. This is why the complex statements
          if ((vm.jobs[jobindex].beginSelectionDate !== undefined && vm.jobs[jobindex].beginSelectionDate !== null) &&
            (vm.jobs[jobindex].endSelectionDate !== undefined && vm.jobs[jobindex].endSelectionDate !== null)) {

            beginSelectionDate = vm.jobs[jobindex].beginSelectionDate.getTime();
            endSelectionDate = vm.jobs[jobindex].endSelectionDate.getTime();

          } else if ((vm.jobs[jobindex].beginSelectionDate !== undefined && vm.jobs[jobindex].beginSelectionDate !== null) &&
            (vm.jobs[jobindex].endSelectionDate === undefined || vm.jobs[jobindex].endSelectionDate === null)) {

            beginSelectionDate = vm.jobs[jobindex].beginSelectionDate.getTime();
            endSelectionDate = Date.now();
          }

          //DbService Handles the values of beginSelectionDate and endSelectionDate
          DbService.getRuns(vm.id, id, limit, beginSelectionDate, endSelectionDate, function (result) {

            result.data.sort(function(a, b) {
              if (a.time > b.time) {
                return -1;
              } else if (a.time < b.time){
                return 1;
              } else {
                return 0;
              }
            });
            vm.lastRunLimit = limit; //set the last limit
            vm.jobs[jobindex].runs = result.data;
            vm.jobs[jobindex].runsAlreadyLoaded = true;
            if (vm.jobs[jobindex].valueUnit !== undefined) {
              ChartService.fillControlChartData(vm.jobs[jobindex]);
              ChartService.fillControlChartConfig(vm.jobs[jobindex]);
            }
          }, fancyError);
        }
      }

      function setControlLimits(jid, upperControlLimit, lowerControlLimit, job) {

        if (jid !== undefined || upperControlLimit !== undefined || lowerControlLimit !== undefined || !isNaN(upperControlLimit) || !isNaN(lowerControlLimit)) {
          DbService.setControlLimits(vm.id, jid, upperControlLimit, lowerControlLimit, function () {

            delete job.chartOptions;
            ChartService.fillControlChartConfig(job);
            job.chartOptions.lowerCL = lowerControlLimit;
            job.chartOptions.upperCL = upperControlLimit;
            $scope.$applyAsync();
          }, fancyError);
        }
      }

      function deleteJob(jid) {
        if (confirm('Are you sure you want to permanently delete job id ' + jid + '?')) {
          DbService.deleteJob(vm.id, jid, function () {
            //niceMsg(msg);
            getJobs(vm.id);
          }, fancyError);
        }
      }

      function deleteRun(jobindex, jid, rid) {
        DbService.deleteRun(vm.id, jid, rid, function () {
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

      function jobOrderBy(job) {
        var value;
        var status = job.currentStatus;
        switch(status) {
          case 'FAILURE': 
            value = 0;
            break;
          case 'UNSTABLE':
            value = 1;
            break;
          case 'SUCCESS':
            value = 2;
            break;
          default:
            value = 10;
            break;
        }
        return value;
      }
    });
})();
