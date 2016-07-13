// // 'use strict';
// // /**
// //  * @ngdoc function
// //  * @name sharabelwasl.controller:TranslateController
// //  * @description
// //  * # TranslateController
// //  * Common application controller
// //  */
// var sharabelwasl = angular.module('sharabelwasl');
// var sharabelwasl.controllers = sharabelwasl.controllers || {};

// sharabelwasl.controllers.translateController = function ($scope, $rootScope, $translate, $interval, VERSION_TAG) {
//     /**
//      * Cache busting
//      */
//     $rootScope.VERSION_TAG = VERSION_TAG;

//     /**
//      * Translations for the view
//      */
//     var pageTitleTranslationId = 'PAGE_TITLE';
//     var pageContentTranslationId = 'PAGE_CONTENT';

//     $translate(pageTitleTranslationId, pageContentTranslationId)
//       .then(function (translatedPageTitle, translatedPageContent) {
//         $rootScope.pageTitle = translatedPageTitle;
//         $rootScope.pageContent = translatedPageContent;
//       });

//     /**
//      * $scope.locale
//      */
//     $scope.locale = $translate.use();

//     /**
//      * Provides info about current route path
//      */
//     $rootScope.$on('$routeChangeSuccess', function (event, current) {
//       $scope.currentPath = current.$$route.originalPath;
//     });

//     /**
//      * Current time
//      */
//     $scope.currentTime = Date.now();
//     $interval(function () {
//       $scope.currentTime = Date.now();
//     }, 1000);
// }

// angular.module('sharabelwasl')
//   .controller('TranslateController', sharabelwasl.controllers.translateController);
