/**
 * @ngdoc function
 * @name sharabelwasl.controller:QueryController
 * @description
 * # QueryController
 * Common application controller
 */
var sharabelwasl = angular.module('sharabelwasl');
sharabelwasl.requests = sharabelwasl.requests || {};

sharabelwasl.requests.search_callback = function($scope, data){

    var self = this;

    self.group_to_pages = function(data) {

        $scope.lang_first = $scope.current_lang+"_first";
        $scope.lang_second = $scope.current_lang+"_second";

        $scope.currentPage = 0;
        $scope.pagedItems = [];
        $scope.titles = [];

        $scope.hgt = 100;

        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            $scope.pagedItems[i] = obj; 
            for (var title in obj) {
                var hgt = Math.floor(20*obj[title].length);
                if (hgt > $scope.hgt) {$scope.hgt = hgt;}
                if (obj.hasOwnProperty(title)) {
                    $scope.titles.push(title);
                }
            }
        }

        $('html,body').animate({scrollTop: $(angular.element('.read')).top}, 'slow'); 

    };

    self.group_to_pages(data);

    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
}

sharabelwasl.requests.page_load = function($http, $scope, path) {
    if (path) {
        $scope.results = [];
        $http({
            url      : path,
            method   : 'GET',
            headers : { 'X-Requested-With' :'XMLHttpRequest'}
        })
        .then(function(response) {
            switch (response.data['next'].toLowerCase()) {
                case "search":
                    sharabelwasl.requests.search_callback($scope, response.data['data']);
                    break;
                default:
                     console.log("");
            }
        });   
    }
    return;
}

angular.module('sharabelwasl')
  .controller('QueryController', function($scope, $location, $http, $translateLocalStorage) {

    $scope.current_lang = $translateLocalStorage.get();
    sharabelwasl.requests.page_load($http, $scope, $location.path());


    var read = "#read";

    $scope.searchFilter = {};
    $scope.tip = "Search";
  
    $scope.isSearchOpen = false;

    $scope.search = function(obj) {
        $scope.results = [];
        var term = encodeURI(obj.target.attributes.search.value);
        $scope.current_lang = $translateLocalStorage.get();
        var path = '/search/'+$scope.current_lang+'/'+term;
        $location.path(path);
        $http({
            url      : path,
            method   : 'GET',
            headers : { 'X-Requested-With' :'XMLHttpRequest'}
        })
        .then(function(response) {
            sharabelwasl.requests.search_callback($scope, response.data['data']);
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
