(function () {
  'use strict';


  /**
   * @ngdoc service
   * @name lwefd.ChartService
   * @description
   * # ChartService
   */
  angular.module('lwefd')
    .service('ChartService', function () {
      var ChartService = {
        fillControlChartData: fillControlChartData,
        fillControlChartConfig: fillControlChartConfig
      };

      return ChartService;

      function fillControlChartData(job) {
        job.chartData = [

        ];
        for (var i = 0; i < job.runs.length; i++) {
          var d = job.runs[i];
          job.chartData.push({
            index: i,
            value: d.value,
            time: d.time
          })
        }
      }

      function fillControlChartConfig(job) {
        job.chartOptions = {
          title : job.name,
          height: 450,
          xAxisUnit: 'time...TODO',
          yAxisUnit: job.valueUnit
        };
      }
    });
})();
