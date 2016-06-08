(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name lwefd.directive:d3
   * @description
   * # d3
   */
  angular.module('lwefd')
    .directive('d3', function ($filter) {

      var scope = {
        data : "=",
        options : "="
      };

      function link(scope, element, attrs) {

        var data = scope.data;
        var options = scope.options;

        //Analyze data
        var dataMin = d3.min(data, function (d) {
            return d.value;
          }),
          dataMax = d3.max(data, function (d) {
            return d.value;
          });

        var dataRange = dataMax - dataMin,
          rangePadding = dataRange / 10;

        // Set the dimensions of the canvas / graph
        var margin = {top: 30, right: 20, bottom: 30, left: 50},
          width = element[0].offsetParent.offsetWidth - margin.left - margin.right,
          height = options.height - margin.top - margin.bottom;

        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().clamp(true).range([height, 0]);

        var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(data.length)
          .tickFormat(function (d) {
            return $filter('date')(data[d].time, 'medium');
          });

        var yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(15);

        var path = d3.svg.line()
          .x(function(d) {
            return x(d.index);
          })
          .y(function(d) {
            return y(d.value);
          });

        var svg = d3.select(element[0])
          .append("svg")
          .attr('width', '100%')
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) {
          return d.index;
        }));
        y.domain(d3.extent(data, function(d) {
          return d.value;
        }));

        // Add the valueline path.
        svg.append("path")
          .attr("class", "line")
          .attr("d", path(data));

        // Add the X Axis
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        // Add the Y Axis
        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

        //svg.selectAll('path').on('mouseover', function (d){
        //  console.log(JSON.stringify(d));
        //});

      }
      return {
        scope: scope,
        link: link
      };
    });
})();
