/**
 * @ngdoc function
 * @name sharabelwasl.directive:LanguageSelectDirective
 * @description
 * # LanguageSelectDirective
 * Directive to append language select and set its view and behavior
 */
var sharabelwasl = angular.module('sharabelwasl');

angular.module('sharabelwasl')
  .directive('languageSelect', function (LanguageSelectService) {
    'use strict';

    return {
      restrict: 'A',
      replace: true,
      template: ''+
        

          // '<div class="top-nav">'+
          // '<ul>'+
          //   '<li ng-repeat="localesDisplayName in localesDisplayNames">'+
          //     '<div class="diwanltr">'+
          //       '<a class="diwanltr-menu" href="#"  ng-click="changeLanguage(localesDisplayName)">{{localesDisplayName}}</a>'+
          //     '</div>'+
          //   '</li>'+
          // '</ul>'+
          // '</div>'+

        '<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" >'+
      	'<div class="container">'+
        '<div class="navbar-header"></div>'+
        '<div id="navbar" class="navbar-collapse collapse">'+
        '<ul><li ng-repeat="localesDisplayName in localesDisplayNames">'+
        '<a class="diwanltr-menu" href="#"  ng-click="changeLanguage(localesDisplayName)">{a localesDisplayName a}</a>'+
        '</li></ul></div><!--/.navbar-collapse --></div></nav>'+
           
      '',
      controller: function ($scope) {
        $scope.currentLocaleDisplayName = LanguageSelectService.getLocaleDisplayName();
        $scope.localesDisplayNames = LanguageSelectService.getLocalesDisplayNames();
        // $scope.visible = $scope.localesDisplayNames &&
        // $scope.localesDisplayNames.length > 1;

        $scope.changeLanguage = function (locale) {
          LanguageSelectService.setLocaleByDisplayName(locale);
        };
      }
    };
  });

// angular.module('sharabelwasl')
//   .directive('opensearch', function () {
//     var isOpen = false;
//     return {
//       restrict: 'A',
//       link: function(scope, element) {

//         element.bind('click', function(e) {
//           var btn = angular.element(e.target).parent().find('button')[0];
//           alert($compile);
//           if (!isOpen) {
//             isOpen = true;
//             angular.element(btn).trigger('click');
            
//           }
//           return false;
//         });
//       }
//     };
// });
