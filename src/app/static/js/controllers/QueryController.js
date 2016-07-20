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
  .controller('QueryController', function($scope, $location, $http, $translateLocalStorage) {

    var vm = this;
    vm.query = {"term" : ""};

    vm.get_current_lang = function() {
      return $translateLocalStorage.get();
    };

    vm.ajax = function(path, _callback) {
      $http({
          url      : path,
          method   : 'GET',
          headers : { 'X-Requested-With' :'XMLHttpRequest'}
      })
      .then(function(response) {
          // sharabelwasl.requests.search_callback($scope, response.data['data']);
          _callback(response.data['data']);
      }, function ( response ) {
          // TODO: handle the error somehow
      });
    };

    vm.execute_search = function(term) {
      var path = '/search/'+vm.get_current_lang()+'/'+term;
      $location.path(path);
      vm.ajax(path, vm.search_callback);
    }

    vm.user_search = function() {
      vm.execute_search(encodeURI(vm.query.term));
    };

    vm.popular_search = function(obj) {
      vm.execute_search(encodeURI(obj.target.attributes.search.value));
    };

    vm.search = function(obj) {

      if (typeof obj === 'undefined') {
        vm.user_search();
      } else {
        vm.popular_search(obj);
      }
    };

    vm.search_callback = function(data) {

      vm.current_page = 0, vm.paged_items = [], vm.titles = [], vm.hgt = 100;
      vm.lang_first = vm.current_lang+"_first";
      vm.lang_second = vm.current_lang+"_second";
      
      for (var i=0; i < data.length; i++) {

        vm.paged_items[i] = data[i];

        for (var title in data[i]) {

          var hgt = Math.floor(20*data[i][title].length);

          if (hgt > vm.hgt) {vm.hgt = hgt;}
          if (data[i].hasOwnProperty(title)) {vm.titles.push(title);}

        }
      }

      // $('html,body').animate({scrollTop: $(angular.element('#read')).offset().top}, 'slow'); 

    };

    vm.prev_page = function () {
        if (vm.current_page > 0) {
            vm.current_page--;
        }
    };
    
    vm.next_page = function () {
        if (vm.current_page < vm.paged_items.length - 1) {
            vm.current_page++;
        }
    };
    
    vm.set_page = function () {
        vm.current_page = this.n;
    };
    
});