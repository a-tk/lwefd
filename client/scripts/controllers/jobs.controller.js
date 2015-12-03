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
            if (vm.jobs[jobindex].valueUnit !== undefined) {
              vm.jobs[jobindex].chartLabels = [];
              updateChartLabels(vm.jobs[jobindex]);
              vm.jobs[jobindex].chartData = [[]];
              vm.jobs[jobindex].chartColors = [[]];
              updateChartData(vm.jobs[jobindex]);
              vm.jobs[jobindex].chartSeries = [];
              updateChartSeries(vm.jobs[jobindex]);
            }
          }, fancyError);
        }
      }

      function updateChartLabels (job) {
        for (var i = 0; i < job.runs.length; i++) {
          job.chartLabels.push(job.runs[i].number);
        }
      }

      function updateChartData (job) {
        for (var i = 0; i < job.runs.length; i++) {
          job.chartData[0].push(job.runs[i].value);
          job.chartColors[0].push('#FFF');
        }
      }

      function updateChartSeries (job) {
        job.chartSeries.push(job.valueUnit);
      }

      function deleteJob(jid) {
        DbService.deleteJob(vm.id, jid, function () {
          //niceMsg(msg);
          getJobs(vm.id);
        }, fancyError);
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
    })
    .config(['ChartJsProvider', function (ChartJsProvider) {
      // Configure all charts
      ChartJsProvider.setOptions({
        colours: ['#5bc0de'],
        responsive: true
      });
      // Configure all line charts
      ChartJsProvider.setOptions('Line', {
        datasetFill: false,
        datasetStroke: false,
        bezierCurve: false
      });
    }]);
})();
