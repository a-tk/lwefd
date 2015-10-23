(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['usersService'];

    function UsersCtrl(usersService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Users';
        vm.users = [];
        vm.activate = activate;

        activate();

        function activate() {
            vm.users = usersService.getAll();
        }
    }
})();