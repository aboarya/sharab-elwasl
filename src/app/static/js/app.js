'use strict';

/**
 * @ngdoc overview
 * @name sharabelwasl
 * @description
 * # sharabelwasl
 *
 * Main module of the application.
 */
var sharabelwasl = angular
  .module('sharabelwasl', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate',
    'ui.bootstrap',
    'tmh.dynamicLocale',
    'xeditable',
    'ui.router'
  ])
  .factory('$qasidas', function() {

    var _ = [];
    var service = {};    

    service.clear = function() {
      _ = [];
    }
    service.add = function(q) {
        _.push(q);
    };

    service.items = function() {
        return _;
    };

    return service;
  })
  .constant('DEBUG_MODE', /*DEBUG_MODE*/true/*DEBUG_MODE*/)
  .constant('VERSION_TAG', /*VERSION_TAG_START*/new Date().getTime()/*VERSION_TAG_END*/)
  .constant('LOCALES', {
    'locales': {
      'en': 'EN',
      'de': 'DE',
      'fr': 'FR',
      'nl': 'NL',
      'ar': 'العربيه'
    },
    'preferredLocale': 'ar'
  })
  .run(function($rootScope, $route, $location, $http, $state){
      $rootScope.is_loading = function () {
        return $http.pendingRequests.length > 0;
      };

    $rootScope.$watch($rootScope.is_loading, function (v) {
      if(v){
        angular.element(document).find("html").addClass("loading");
      } else{
          setTimeout(function(){angular.element(document).find("html").removeClass("loading");}, 200);
      }
    });

    $rootScope.ajax = function(path, _callback) {
      
      $http({
          url      : path,
          method   : 'GET',
          headers : { 'X-Requested-With' :'XMLHttpRequest'}
      })
      .then(function(response) {
        _callback(response.data['data']);
      });
    }

    $rootScope.$on('$locationChangeSuccess', function() {
        // $rootScope.actualLocation = $location.path();
    });        

    $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
      if($rootScope.actualLocation === newLocation) {
          $state.go('main', {});
          // var x = $state;
          // var y = "";
      }
    });
  })
  .config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{a');
    $interpolateProvider.endSymbol('a}');
  }])
  // Angular debug info
  .config(function ($compileProvider, DEBUG_MODE) {
    if (!DEBUG_MODE) {
      $compileProvider.debugInfoEnabled(false);// disables AngularJS debug info
    }
  })
  // Angular Translate
  .config(function ($translateProvider, DEBUG_MODE, LOCALES) {
    

    $translateProvider.useStaticFilesLoader({
      prefix: 'resources/locale-',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage(LOCALES.preferredLocale);
    $translateProvider.useLocalStorage();
  })
  // Angular Dynamic Locale
  .config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
  })
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main');

    $stateProvider
      .state('main', {
          url: '/main',
          templateUrl: '/partial/search-section'
        })
      .state('search', {
        url: '/search',
        templateUrl: '/partial/results-section'
      })
        
}]);

