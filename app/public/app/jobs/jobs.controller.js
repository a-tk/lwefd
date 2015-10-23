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
      vm.jobs = DataService.getJobs(1);
    }
  }
})();