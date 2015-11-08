(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name simpleBlogApp.directive:scrollToElement
   * @description
   * # scrollToElement
   */
  angular.module('simpleBlogApp')
    .directive('scrollToElement', function () {
      return {
        scope: {
          scrollTo: '@'
        },
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
          element.on('click', function () {
            $('body').animate({scrollTop: $(scope.scrollTo).offset().top}, 'slow');
          });
        }
      };
    });
})();
