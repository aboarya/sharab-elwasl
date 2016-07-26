/**
 * @ngdoc function
 * @name sharabelwasl.controller:QueryController
 * @description
 * # QueryController
 * Common application controller
 */
// var sharabelwasl = angular.module('sharabelwasl');
// sharabelwasl.requests = sharabelwasl.requests || {};

angular.module('sharabelwasl')
  .controller('SearchController', function($rootScope, $scope, $state, $http, $qasidas) {

    var vm = $scope;
    var $_ = $rootScope;

    vm.query = {"term" : "", "template_url" : "/partial/search-section"};
    vm.cached_verses = []; vm.warning = false;

    vm.execute_search = function(term) {
      angular.element(document).find("html").removeClass("full");
      var path = '/search/'+$_.get_current_lang()+'/'+term;
      $_.ajax(path, vm.search_callback);
    }

    
    vm.user_search = function() {
      if (vm.query.term.length == 0) {
        vm.warning = true; return;
      }
      vm.execute_search(encodeURI(vm.query.term));
    };

    vm.popular_search = function(obj) {
      vm.execute_search(encodeURI(obj.target.attributes.search.value));
    };

    vm.search = function(obj) {
      vm.lang_first = $_.get_current_lang()+"_first";
      vm.lang_second = $_.get_current_lang()+"_second";
      vm.lang_title = $_.get_current_lang()+"_title";
      
      if (typeof obj == 'undefined') {
        vm.user_search();
      } else {
        vm.popular_search(obj);
      }
    };
    
    vm.search_callback = function(data) {

      $qasidas.clear();
      
      for (var i=0; i < data.length; i++) {
        $qasidas.add(new Qasida($_.get_current_lang(), data[i][0], data[i][1]));
      };
      
      $state.go("search");

    };

});
