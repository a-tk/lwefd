(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name simpleBlogApp.directive:renderOnFinish
   * @description
   * # scrollToElement
   */
  angular.module('lwefd')
    .directive('renderOnFinish', function ($timeout) {
      return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
          if (scope.$last === true) {
            $timeout(function () {
              scope.$emit('ngRepeatFinished');
            });
          }
        }
      };
    });
})();
