/**
 * @ngdoc function
 * @name sharabelwasl.controller:QueryController
 * @description
 * # QueryController
 * Common application controller
 */
var sharabelwasl = angular.module('sharabelwasl');

angular.module('sharabelwasl')
  .controller('QueryController', function($scope, es, $translateLocalStorage) {

    var read = "#read";
    $scope.map = {"_title":"", "_first":"", "_second":""};

    $scope.searchFilter = {};
    $scope.tip = "Search";
  
    $scope.isSearchOpen = false;

    $scope.show_results = function(results) {
    
        var currentLang = $translateLocalStorage.get();
        for (var key in $scope.map) {
            $scope.map[key] = currentLang+key;
        }

        $scope.results = results.map(function(result){
            list = [];
            for (var key in $scope.map) {
                var es_key = $scope.map[key];
                list[key] = result['_source'][es_key];
            }
            return list;
        });


    }

    $scope.search = function(obj) {
        var term = obj.target.attributes.search.value;
        es.search({
            index: 'sharab-elwasl',
            size: 50,
            body: {"query":{"bool":{"must":[{"query_string":{"default_field":"_all","query":"love"}}],"must_not":[],"should":[]}},"from":0,"size":10,"sort":[],"aggs":{}}
        }).then(function (response) {
            $scope.show_results(response.hits.hits);
            $('html,body').animate({scrollTop: $("#read").offset().top},'slow');
        });
    }
  
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
