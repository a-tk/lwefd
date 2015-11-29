'use strict';

/**
 * @ngdoc overview
 * @name lwefd
 * @description
 * # lwefd
 *
 * Main module of the application.
 */
angular
  .module('lwefd', [
    'ngAnimate',
    'ngResource',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/summary.view.html',
        controller: 'SummaryCtrl'
      })
      .when('/jobs/:productName', {
        templateUrl: 'views/jobs.view.html',
        controller: 'JobsCtrl'
      })
      .when('/configure', {
        templateUrl: 'views/config.view.html',
        controller: 'ConfigCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
