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
    // 
    var vm = this;
    // $scope.is_loading = false;
    vm.query = {"term" : "", "template_url" : "/partial/search-section"};
    vm.cached_verses = [];
    

    vm.get_current_lang = function() {
      return $translateLocalStorage.get();
    };

    $scope.is_loading = function () {
      return $http.pendingRequests.length > 0;
    };



    $scope.$watch($scope.is_loading, function (v) {
      if(v){
        angular.element(document).find("html").addClass("loading");
      } else{
          setTimeout(function(){angular.element(document).find("html").removeClass("loading");}, 200);
      }
    });

    vm.ajax = function(path, _callback) {
      
      $http({
          url      : path,
          method   : 'GET',
          headers : { 'X-Requested-With' :'XMLHttpRequest'}
      })
      .then(function(response) {
        _callback(response.data['data']);
      });
    }

    vm.execute_search = function(term) {
      angular.element(document).find("html").removeClass("full");
      var path = '/search/'+vm.get_current_lang()+'/'+term;
      $location.url(path);
      vm.ajax(path, vm.search_callback);
    }

    vm.back_to_search = function() {
      
      angular.element(document).find("html").addClass("loading");
      vm.query.template_url = '/partial/search-section';
      setTimeout(function() {
        angular.element(document).find("html").addClass("full");
        angular.element(document).find("html").removeClass('loading');
        }, 250);
      
      
    }

    vm.user_search = function() {
      vm.execute_search(encodeURI(vm.query.term));
    };

    vm.popular_search = function(obj) {
      vm.execute_search(encodeURI(obj.target.attributes.search.value));
    };

    vm.search = function(obj) {

      if (typeof obj == 'undefined') {
        vm.user_search();
      } else {
        vm.popular_search(obj);
      }
    };

    vm.check_better_translation = function(verses) {
      
      vm.verse = verses[vm.current_verse];
      var verse_key = vm.verse[vm.lang_first].replace(' ','_')+"_"+vm.verse[vm.lang_second].replace(' ','_');
      if (vm.cached_verses.indexOf(verse_key) == -1) {

        vm.cached_verses.push(verse_key);
        var line = vm.verse['line_number']; var number = vm.verse['qasida_number'];
        var path = "/dynamo/scan/"+vm.get_current_lang()+"/"+number+"/"+line;
        vm.ajax(path, vm.check_better_translation_callback);  
      }

    }

    vm.check_better_translation_callback = function(data) {
      if (data.hasOwnProperty("qasida_number")) {
        for (title in vm.qasidas[vm.current_qasida]) {
          vm.qasidas[vm.current_qasida][title][vm.current_verse] = data;
        }
      }
    }

    vm.search_callback = function(data) {
      if (data.length == 0){ return ;}

      vm.current_qasida = 0, vm.current_verse = 0, vm.qasidas = [];
      vm.verses = [], vm.titles = [], vm.hgt = 100;
      vm._next_qasida = 1, vm._prev_qasida = -1;

      for (var i=0; i < data.length; i++) {

        vm.qasidas[i] = data[i];
    
        for (var title in data[i]) {
          var hgt = Math.floor(20*data[i][title].length);      
          if(i==0) {vm.check_better_translation(data[i][title]);}
          if (hgt > vm.hgt) {vm.hgt = hgt;}
          if (data[i].hasOwnProperty(title)) {vm.titles.push(title);}

        }
      }
      vm.query.template_url = '/partial/results-section'
      // $('html,body').animate({scrollTop: $(angular.element('#read')).offset().top}, 'slow'); 

    };

    vm.prev_qasida = function () {
      vm.current_verse = 0;
      if (vm.current_qasida > 0) {
        vm.current_qasida--;
        for (title in vm.qasidas[vm.current_qasida]){vm.check_better_translation(vm.qasidas[vm.current_qasida][title]);}
        vm._next_qasida--;
        vm._prev_qasida--;
      }
    };
    
    vm.next_qasida = function () {
      vm.current_verse = 0;
      if (vm.current_qasida < vm.qasidas.length - 1) {
          vm.current_qasida++;
          for (title in vm.qasidas[vm.current_qasida]){vm.check_better_translation(vm.qasidas[vm.current_qasida][title]);}
          vm._next_qasida++;
          vm._prev_qasida++;
      }
    };
    
    vm.set_qaisda = function () {
        vm.current_qasida = this.n;
    };

    vm.prev_verse = function () {
        if (vm.current_verse > 0) {
            vm.current_verse--;
            for (title in vm.qasidas[vm.current_qasida]){vm.check_better_translation(vm.qasidas[vm.current_qasida][title]);}
        }
    };
    
    vm.next_verse = function () {
      for (title in vm.qasidas[vm.current_qasida])
      {
        if (vm.current_verse < vm.qasidas[vm.current_qasida][title].length - 1) {
            vm.current_verse++;
            vm.check_better_translation(vm.qasidas[vm.current_qasida][title]);
        }
      }
        
    };
    
    vm.set_verse = function (n) {
        vm.current_verse = n;
    };

    vm.fix_title = function (title) {
        return title.replace(")", "").replace("(", "");
    };

    vm.range = function (start, end) {
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

    vm.lang_first = vm.get_current_lang()+"_first";
    vm.lang_second = vm.get_current_lang()+"_second";
    vm.lang_title = vm.get_current_lang()+"_title";
});