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

        drawGraph(scope, element, attrs, data, options);

        scope.$watch('options', function () {
          d3.select(element[0]).select('svg').remove();
          data = scope.data;
          options = scope.options;
          drawGraph(scope, element, attrs, data, options);
        });
        scope.$watch('data', function () {
          d3.select(element[0]).select('svg').remove();
          data = scope.data;
          options = scope.options;
          drawGraph(scope, element, attrs, data, options);
        });
      }

      function drawGraph (scope, element, attrs, data, options) {

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

        x.domain(d3.extent(data, function(d) {
          return d.index;
        }));

        //If any more information is displayed on the graph, add it to these arrays so that is fits within the scale
        var yDomainLowerBound = d3.min([dataMin, lowerRunningCL, lowerDefinedCL]);
        var yDomainUpperBound = d3.max([dataMax, upperRunningCL, upperDefinedCL]);

        //Pad by x% to make the graph more readable
        var domainPadding = (yDomainUpperBound - yDomainLowerBound) / 10;

        y.domain([yDomainLowerBound - domainPadding, yDomainUpperBound + domainPadding]);

        //Draw the chart

        var svg = getCtrlChartSvg(element[0], '100%', height + margin.top + margin.bottom, margin);

        var path = getCtrlChartPath(x, y);

        appendXAxis(svg, height, xAxis, options.rotateXAxisLabels);

        appendYAxis(svg, yAxis);

        appendGrid(svg, xAxis, height);

        appendGrid(svg, yAxis, -width);

        appendControlLimits(svg, y, width, 'runningCL', upperRunningCL, lowerRunningCL, 'Calculated');

        appendControlLimits(svg, y, width, 'definedCL', upperDefinedCL, lowerDefinedCL, 'Defined');

        appendPath(svg, path, data);

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

      function appendControlLimits(svg, yScale, width, cssClass, ucl, lcl, description){
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
        var fillSpace = svg.append('g')
          .attr('class', cssClass);
        fillSpace.append('rect')
          .attr('x', 0)
          .attr('y', yScale(ucl))
          .attr('width', width)
          .attr('height',  yScale(lcl) -  yScale(ucl));
        fillSpace.append('text')
          .attr('x', 5)
          .attr('y', yScale(ucl) + 10)
          .attr('dy', '.35em')
          .attr('font-size', '10')
          .text(description + ' UCL = ' + d3.round(ucl, 0) + ' LCL = ' + d3.round(lcl, 0));
      }

      return {
        scope: scope,
        link: link
      };
    });
})();
