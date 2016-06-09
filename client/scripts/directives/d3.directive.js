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
        data : '=',
        options : '='
      };

      function valueAccessor(d) {
        return d.value;
      }

      function link(scope, element, attrs) {

        var data = scope.data;
        var options = scope.options;

        //Analyze data
        var dataMin = d3.min(data, valueAccessor),
          dataMax = d3.max(data, valueAccessor),
          dataMean = d3.mean(data, valueAccessor),
          dataStdDev = d3.deviation(data, valueAccessor);

        var lowerRunningCL = dataMean - (dataStdDev * 3),
          upperRunningCL = dataMean + (dataStdDev * 3),
          lowerDefinedCL = options.lowerCL,
          upperDefinedCL = options.upperCL;

        // Set the dimensions of the canvas / graph
        var margin = options.margin,
          width = element[0].offsetParent.offsetWidth - margin.left - margin.right,
          height = options.height - margin.top - margin.bottom;

        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis().scale(x)
          .orient('bottom').ticks(data.length)
          .tickFormat(function (d) {
            return $filter('date')(data[d].time, 'medium');
          });

        var yAxis = d3.svg.axis().scale(y)
          .orient('left').ticks(10);

        var path = d3.svg.line()
          .x(function(d) {
            return x(d.index);
          })
          .y(function(d) {
            return y(d.value);
          });

        var svg = d3.select(element[0])
          .append('svg')
          .attr('width', '100%')
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        x.domain(d3.extent(data, function(d) {
          return d.index;
        }));

        var yDomainLowerBound = d3.min([dataMin, lowerRunningCL, lowerDefinedCL]);
        var yDomainUpperBound = d3.max([dataMax, upperRunningCL, upperDefinedCL]);
        var domainPadding = (yDomainUpperBound - yDomainLowerBound) / 10;
        y.domain([yDomainLowerBound - domainPadding, yDomainUpperBound + domainPadding]);


        //running CTRL limits
        svg.append('g')
          .attr('class', 'runningCL')
          .append('line')
          .attr('x1', 0)
          .attr('y1', y(upperRunningCL))
          .attr('x2', width)
          .attr('y2',  y(upperRunningCL));
        svg.append('g')
          .attr('class', 'runningCL')
          .append('line')
          .attr('x1', 0)
          .attr('y1', y(lowerRunningCL))
          .attr('x2', width)
          .attr('y2',  y(lowerRunningCL));
        svg.append('g')
          .attr('class', 'runningCL')
          .append('rect')
          .attr('x', 0)
          .attr('y', y(upperRunningCL))
          .attr('width', width)
          .attr('height',  y(lowerRunningCL) -  y(upperRunningCL));

        //defined CL
        svg.append('g')
          .attr('class', 'definedCL')
          .append('line')
          .attr('x1', 0)
          .attr('y1', y(upperDefinedCL))
          .attr('x2', width)
          .attr('y2',  y(upperDefinedCL));
        svg.append('g')
          .attr('class', 'definedCL')
          .append('line')
          .attr('x1', 0)
          .attr('y1', y(lowerDefinedCL))
          .attr('x2', width)
          .attr('y2',  y(lowerDefinedCL));
        svg.append('g')
          .attr('class', 'definedCL')
          .append('rect')
          .attr('x', 0)
          .attr('y', y(upperDefinedCL))
          .attr('width', width)
          .attr('height',  y(lowerDefinedCL) -  y(upperDefinedCL));


        svg.append('path')
          .attr('class', 'line')
          .attr('d', path(data));

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)
          .selectAll('text')
          .attr('transform', 'rotate('+options.rotateXAxisLabels+')')
          .style('text-anchor', 'start');

        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);


        //svg.append('text')
        //  .attr('x', - height / 2)
        //  .attr('y', -50)//because of rotation, text placement coordinates are reversed
        //  .attr('transform', 'rotate(-90)')
        //  .style('text-anchor', 'middle')
        //  .text(options.yAxisUnit);

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
