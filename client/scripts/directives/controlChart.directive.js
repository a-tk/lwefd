(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name lwefd.directive:controlChart
   * @description
   * # d3
   */
  angular.module('lwefd')
    .directive('controlChart', function ($filter) {

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

        var yAxis = d3.svg.axis().scale(y).orient('left').ticks(10);

        var path = getCtrlChartPath(x, y);

        var svg = getCtrlChartSvg(element[0], '100%', height + margin.top + margin.bottom, margin);

        x.domain(d3.extent(data, function(d) {
          return d.index;
        }));

        var yDomainLowerBound = d3.min([dataMin, lowerRunningCL, lowerDefinedCL]);
        var yDomainUpperBound = d3.max([dataMax, upperRunningCL, upperDefinedCL]);
        var domainPadding = (yDomainUpperBound - yDomainLowerBound) / 10;
        y.domain([yDomainLowerBound - domainPadding, yDomainUpperBound + domainPadding]);

        appendControlLimits(svg, y, width, 'runningCL', upperRunningCL, lowerRunningCL);

        appendControlLimits(svg, y, width, 'definedCL', upperDefinedCL, lowerDefinedCL);

        appendPath(svg, path, data);

        appendXAxis(svg, height, xAxis, options.rotateXAxisLabels);

        appendYAxis(svg, yAxis);

        appendGrid(svg, xAxis, height);

        appendGrid(svg, yAxis, -width);

        appendYAxisTitle(svg, height, options.yAxisUnit);

        //svg.selectAll('path').on('mouseover', function (d){
        //  console.log(JSON.stringify(d));
        //});

      }

      function getCtrlChartSvg (node, width, height, margin) {
        return d3.select(node)
          .append('svg')
          .attr('width', '100%')
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      }

      function getCtrlChartPath(xScale, yScale) {
        return d3.svg.line()
          .x(function(d) {
            return xScale(d.index);
          })
          .y(function(d) {
            return yScale(d.value);
          });
      }

      function appendPath(svg, pathFunction, data) {
        svg.append('path')
          .attr('class', 'line')
          .attr('d', pathFunction(data));
      }

      function appendXAxis(svg, height, axisFunction, labelRotation) {
        svg.append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(axisFunction)
          .selectAll('text')
          .attr('transform', 'rotate('+labelRotation+')')
          .style('text-anchor', 'start');
      }

      function appendYAxis(svg, axisFunction){

        svg.append('g')
          .attr('class', 'axis')
          .call(axisFunction);
      }

      function appendYAxisTitle(svg, height, title) {
        svg.append('text')
          .attr('x', - height / 2)
          .attr('y', -50)//because of rotation, text placement coordinates are reversed
          .attr('transform', 'rotate(-90)')
          .style('text-anchor', 'middle')
          .text(title);
      }

      function appendGrid(svg, axisFunction, gridDistance) {
        svg.append('g')
          .attr('class', 'grid')
          .call(axisFunction.tickSize(gridDistance, 0, 0).tickFormat(""));
      }

      function appendControlLimits(svg, yScale, width, cssClass, ucl, lcl){
        svg.append('g')
          .attr('class', cssClass)
          .append('line')
          .attr('x1', 0)
          .attr('y1', yScale(ucl))
          .attr('x2', width)
          .attr('y2',  yScale(ucl));
        svg.append('g')
          .attr('class', cssClass)
          .append('line')
          .attr('x1', 0)
          .attr('y1', yScale(lcl))
          .attr('x2', width)
          .attr('y2',  yScale(lcl));
        svg.append('g')
          .attr('class', cssClass)
          .append('rect')
          .attr('x', 0)
          .attr('y', yScale(ucl))
          .attr('width', width)
          .attr('height',  yScale(lcl) -  yScale(ucl));
      }

      return {
        scope: scope,
        link: link
      };
    });
})();
