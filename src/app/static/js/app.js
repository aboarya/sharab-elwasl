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
    'ngTouch',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'xeditable',
    'lumx'
  ])
  .constant('DEBUG_MODE', /*DEBUG_MODE*/true/*DEBUG_MODE*/)
  .constant('VERSION_TAG', /*VERSION_TAG_START*/new Date().getTime()/*VERSION_TAG_END*/)
  .constant('LOCALES', {
    'locales': {
      'ar': 'العربيه',
      'fr': 'Français',
      'nl': 'Nederlands',
      'de': 'Deutsch',
      'en': 'English',

      
    },
    'preferredLocale': 'en'
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
    if (DEBUG_MODE) {
      $translateProvider.useMissingTranslationHandlerLog();// warns about missing translates
    }

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
});

sharabelwasl.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
/**
* created shared dynamo db client
*/

