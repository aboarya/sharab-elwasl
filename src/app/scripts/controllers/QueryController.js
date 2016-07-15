/**
 * @ngdoc function
 * @name sharabelwasl.controller:QueryController
 * @description
 * # QueryController
 * Common application controller
 */
var sharabelwasl = angular.module('sharabelwasl');
sharabelwasl.clients = sharabelwasl.clients || {};

angular.module('sharabelwasl')
  .controller('QueryController', function($scope, es, $translateLocalStorage) {

    var read = "#read";

    $scope.ui_map = {"_title":"", "_first":"", "_second":""};

    $scope.searchFilter = {};
    $scope.tip = "Search";
  
    $scope.isSearchOpen = false;

    $scope.show_results = function(results) {
        $scope.dynamo_keys = [];
        var current_lang = $translateLocalStorage.get();

        for (var key in $scope.ui_map) {
            $scope.ui_map[key] = current_lang + key;
        }

        $scope.results = results.map(function(result) {
            var list = [];
            var first_lang = current_lang + "_first";
            var second_lang = current_lang + "_second";
            $scope.dynamo_keys.push({first_lang:result[first_lang], second_lang:result[second_lang]});
            for (var key in $scope.ui_map) {
                
                var es_key = $scope.ui_map[key];
                var value = result['_source'][es_key];
                list[key] = value;
            }
            return list;
        });


        // AWS.config.update({region: 'eu-central-1'});
        var x = AWS.config;
        sharabelwasl.clients = {};
        sharabelwasl.clients.dynamodb = new AWS.DynamoDB();
        var table_name = "user_verse_" + current_lang;
        var params = {RequestItems: {table_name: {Keys: $scope.dynamo_keys}}};

        sharabelwasl.clients.dynamodb.batchGetItem(params, function(err, data){
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            alert(err);
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
