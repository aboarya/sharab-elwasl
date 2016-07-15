/**
 * @ngdoc function
 * @name sharabelwasl.controller:QueryController
 * @description
 * # QueryController
 * Common application controller
 */
var sharabelwasl = angular.module('sharabelwasl');
sharabelwasl.requests = sharabelwasl.requests || {};

sharabelwasl.requests.page_load = function($http, $scope, path) {
    if (path) {
        $scope.results = [];
        $http({
            url      : path,
            method   : 'GET',
            headers : { 'X-Requested-With' :'XMLHttpRequest'}
        })
        .then(function(response) {
            $scope.results = response.data;
            // $scope.$apply();
            $('html,body').animate({scrollTop: $("#read").offset().top},'slow');
        });   
    }
    return;
}

angular.module('sharabelwasl')
  .controller('QueryController', function($scope, $location, $http, $base64, $translateLocalStorage) {

    sharabelwasl.requests.page_load($http, $scope, $location.path());

    var read = "#read";

    $scope.searchFilter = {};
    $scope.tip = "Search";
  
    $scope.isSearchOpen = false;

    $scope.search = function(obj) {
        $scope.results = [];
        var term = encodeURI(obj.target.attributes.search.value);
        var current_lang = $translateLocalStorage.get();
        var path = '/search/'+current_lang+'/'+term;
        $location.path(path);
        $http({
            url      : path,
            method   : 'GET',
            headers : { 'X-Requested-With' :'XMLHttpRequest'}
        })
        .then(function(response) {
            $scope.results = response.data;
            // $scope.$apply();
            $('html,body').animate({scrollTop: $("#read").offset().top},'slow');
        });
    }   
  
    $scope.toggleSearch = function() {
        $scope.isSearchOpen = !$scope.isSearchOpen;
    }

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
