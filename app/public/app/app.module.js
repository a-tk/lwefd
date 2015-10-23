(function () {
    'use strict';

    angular
        .module('app', ['ngAnimate', 'ngRoute'])
        .config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];

    function routeConfig($routeProvider) {
        $routeProvider
          .when('/', {
              templateUrl: 'app/dashboard/dashboard.html'
          })
          .when('/dashboard', {
              redirectTo: '/'
          })
          .when('/jobs', {
              templateUrl: 'app/jobs/jobs.html'
          })

          .otherwise({ redirectTo: '/' });
    }

})();