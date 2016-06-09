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

        for (var i = 0, k = job.runs.length; i < job.runs.length && k >= 0; k--, i++) {
          var d = job.runs[k - 1]; // need to pick these ones out first, otherwise the array indices are not correct for the graph
          job.chartData.push({
            index: i,
            //index: job.runs.length - i,
            value: d.value,
            time: d.time
          })
        }
      }

      function fillControlChartConfig(job) {
        job.chartOptions = {
          margin: {top: 10, right: 80, bottom: 70, left: 75},
          title : job.name,
          height: 450,
          xAxisUnit: 'time...TODO',
          yAxisUnit: job.valueUnit,
          rotateXAxisLabels: 15,
          lowerCL : job.upperControlLimit,
          upperCL : job.lowerControlLimit
        };
      }
    });
})();
