/**
 * @ngdoc function
 * @name sharabelwasl.directive:LanguageSelectDirective
 * @description
 * # LanguageSelectDirective
 * Directive to append language select and set its view and behavior
 */
var sharabelwasl = angular.module('sharabelwasl');

angular.module('sharabelwasl')
  .directive('ngTranslateLanguageSelect', function (LanguageSelectService) {
    'use strict';

    return {
      restrict: 'A',
      replace: true,
      template: ''+
        // '<div class="language-select" ng-if="visible">'+
        //   '<label>'+
        //     '{{"directives.language-select.Language" | translate}}:'+
        //     '<select ng-model="currentLocaleDisplayName"'+
        //       'ng-options="localesDisplayName for localesDisplayName in localesDisplayNames"'+
        //       'ng-change="changeLanguage(currentLocaleDisplayName)">'+
        //     '</select>'+
        //   '</label>'+
        // '</div>'+
        // '<div class="top-nav">'+
        //   '<ul>'+
        //     '<li ng-click="changeLanguage(currentLocaleDisplayName)">'+
        //       '<div class="diwanltr">'+
        //         '<a class="diwanltr-menu" href="#"  ng-model="currentLocaleDisplayName">العربيه</a>'+
        //       '</div>'+
        //     '</li>'+
        //     '<li>'+
        //       '<div class="main-nav-link">'+
        //         '<a ng-model="currentLocaleDisplayName" ng-click="changeLanguage(currentLocaleDisplayName)">Deutsch</a>'+
        //       '</div>'+
        //     '</li>'+
        //     '<li>'+
        //       '<div class="main-nav-link">'+
        //         '<a>English</a>'+
        //       '</div>'+
        //     '</li>'+
        //   '</ul>'+
        //   '</div>'+


          '<div class="top-nav">'+
          '<ul>'+
            '<li ng-repeat="localesDisplayName in localesDisplayNames">'+
              '<div class="diwanltr">'+
                '<a class="diwanltr-menu" href="#"  ng-click="changeLanguage(localesDisplayName)">{{localesDisplayName}}</a>'+
              '</div>'+
            '</li>'+
          '</ul>'+
          '</div>'+ 
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

angular.module('sharabelwasl')
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
