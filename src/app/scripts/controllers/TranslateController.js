'use strict';
/**
 * @ngdoc function
 * @name sharabelwasl.controller:TranslateController
 * @description
 * # TranslateController
 * Common application controller
 */
var sharabelwasl = angular.module('sharabelwasl');
sharabelwasl.controllers = sharabelwasl.controllers || {};

sharabelwasl.controllers.translateController = angular.module('sharabelwasl')
  .controller('TranslateController', function ($scope, $rootScope, $translate, $interval, VERSION_TAG) {
    /**
     * Cache busting
     */
    $rootScope.VERSION_TAG = VERSION_TAG;

    /**
     * Translations for the view
     */
    var pageTitleTranslationId = 'PAGE_TITLE';
    var pageContentTranslationId = 'PAGE_CONTENT';

    $translate(pageTitleTranslationId, pageContentTranslationId)
      .then(function (translatedPageTitle, translatedPageContent) {
        $rootScope.pageTitle = translatedPageTitle;
        $rootScope.pageContent = translatedPageContent;
      });

    /**
     * $scope.locale
     */
    $scope.locale = $translate.use();

    /**
     * Provides info about current route path
     */
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
      $scope.currentPath = current.$$route.originalPath;
    });

    /**
     * Current time
     */
    $scope.currentTime = Date.now();
    $interval(function () {
      $scope.currentTime = Date.now();
    }, 1000);


    /**
     * EVENTS
     */
    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      $scope.locale = data.language;
      $rootScope.pageTitle = $translate.instant(pageTitleTranslationId);
      $rootScope.pageContent = $translate.instant(pageContentTranslationId);
    });

    $scope.searchFilter = {};
    $scope.tip = "Search";
  
    $scope.isSearchOpen = false;
  
    $scope.toggleSearch = function() {
      $scope.isSearchOpen = !$scope.isSearchOpen;
    };
});

angular.module('sharabelwasl')
  .decorator('lxSearchFilterDirective', function($delegate){
    // add param into scope
    $delegate[0].scope.isOpen = '=';
  
    console.log($delegate[0].scope);
  
    // overwrite link function
    var originalLinkFn = $delegate[0].link;
  
    $delegate[0].compile = function(tElem, tAttr) {
      return function newLinkFn(scope, element, attrs, ctrl, transclude) {
        // fire the originalLinkFn
        originalLinkFn.apply($delegate[0], arguments);
      
        // additional behavior
        scope.$watch(function(){
          return ctrl.isOpen;
        }, function(newValue){
          if (newValue) ctrl.openInput();
          else ctrl.blurInput();
        });
      };
    };
  
    // get rid of the old link function since we return a link function in compile
    delete $delegate[0].link;

    // return the $delegate
    return $delegate;
});
