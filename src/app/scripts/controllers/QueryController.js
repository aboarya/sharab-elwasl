/**
 * @ngdoc function
 * @name sharabelwasl.controller:QueryController
 * @description
 * # QueryController
 * Common application controller
 */
var sharabelwasl = angular.module('sharabelwasl');
sharabelwasl.controllers = sharabelwasl.controllers || {};

sharabelwasl.controllers.queryController = angular.module('sharabelwasl')
  .controller('QueryController', function($scope, es) {

    $scope.search = function() {
        // alert("on");
        // search for documents
        es.search({
            index: 'sharab-elwasl',
            size: 50,
            body: {
            "query":
                {
                    "match": {
                        "arabic_na":"العينين"
                    }   
                },
            }
        }).then(function (response) {
            var a = "";
        $scope.hits = response.hits.hits;
            var b ="";
        });
    }
});
