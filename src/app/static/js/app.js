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
  .factory('$terms', function() {

    var _ = {};
    var service = {};    

    service.clear = function() {
      _ = {};
    }
    service.add = function(t) {
        _ = t;
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
  .filter('starting', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }
  })
  .config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{a');
    $interpolateProvider.endSymbol('a}');
  }])
  .config(function ($compileProvider, DEBUG_MODE) {
    if (!DEBUG_MODE) {
      $compileProvider.debugInfoEnabled(false);// disables AngularJS debug info
    }
  })
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
        url: '/search/:lang/:term',
        templateUrl: '/partial/search-section'
      })
      .state('read', {
        url: '/read/:lang/:term',
        templateUrl: '/partial/results-section'
      })
        
}])
  .run(function($rootScope, $route, $location, $http, $state, LOCALES, $translateLocalStorage){

      $http.defaults.useXDomain = true;
      $http.defaults.withCredentials = true;
      delete $http.defaults.headers.common["X-Requested-With"];
      $http.defaults.headers.common["Accept"] = "application/json";
      $http.defaults.headers.common["Content-Type"] = "application/json";
      
      $http.defaults.headers.common["Access-Control-Allow-Origin"] = "http://localhost:5000"

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
          $location.url(path);
        });
      }

      $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
      });        

      $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
          $state.go('main', {});
        }
      });

      $rootScope.get_current_lang = function() {
        var lang = $translateLocalStorage.get();
      
        if (typeof(lang) == "undefined" || lang == "undefined" || lang == null) {
          var lang = window.navigator.userLanguage || window.navigator.language;
          lang = lang.split('-')[0];
        }

        return lang;
      };

      var run_search = function(lang, term) {
        $location.url('/search/'+lang+'/'+term);
        $state.go('search', {"lang" : lang, "term" : term});
      } 

      var url = $location.url().split('/');
      if (url.length > 3) {
        var state=url[1];var lang=url[2];var term=url[3];
        if (state == "search" || state == "read") {
          run_search(lang, term)
        }
      }

  });

