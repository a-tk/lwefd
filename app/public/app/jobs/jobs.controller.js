(function () {
  'use strict';

  angular
    .module('app')
    .controller('JobsCtrl', JobsCtrl);

  JobsCtrl.$inject = ['DataService'];

  function JobsCtrl(DataService) {
    /* jshint validthis:true */
    var vm = this;
    vm.title = 'Jobs';
    vm.jobs = [];
    vm.activate = activate;

    activate();

    function activate() {
      getJobs();
    }

    function getJobs() {
      return DataService.getJobs(1)
        .then( function(data) {
          vm.jobs = data.data;
        });
    }
  }
})();