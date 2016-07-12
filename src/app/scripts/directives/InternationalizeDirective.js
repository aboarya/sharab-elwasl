/**
 * @ngdoc function
 * @name sharabelwasl.directive:Internationalize
 * @description
 * # Internationalize
 * Directive to append language select and set its view and behavior
 */
var sharabelwasl = angular.module('sharabelwasl');
sharabelwasl.controllers = sharabelwasl.controllers || {};
sharabelwasl.directives = sharabelwasl.directives || {};

sharabelwasl.directives.internationalize = angular.module('sharabelwasl')
  .directive('ngInternationalize', function (LocaleService) {
    'use strict';

    return {
      restrict: 'A',
      replace: true,
      controller: sharabelwasl.controllers.TranslateController
    };
  });

sharabelwasl.directives.openSearch = angular.module('sharabelwasl')
  .directive('opensearch', function () {
    var isOpen = false;
    return {
      restrict: 'A',
      link: function(scope, element) {

        element.bind('click', function(e) {
          var btn = angular.element(e.target).parent().find('button')[0];
          alert($compile);
          if (!isOpen) {
            isOpen = true;
            angular.element(btn).trigger('click');
            
          }
          return false;
        });
      }
    };
});
