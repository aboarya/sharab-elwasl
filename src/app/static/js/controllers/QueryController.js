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

        $('html,body').animate({scrollTop: $(angular.element('#read')).offset().top}, 'slow'); 

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
        }, function ( response ) {
            // TODO: handle the error somehow
        }).finally(function() {
            // called no matter success or failure
            // $scope.loading = false;
        });   
    }
    return;
}

angular.module('sharabelwasl')
  .controller('QueryController', function($scope, $location, $http, $translateLocalStorage) {

    $scope.current_lang = $translateLocalStorage.get();
    // $scope.show_translations = false;
    sharabelwasl.requests.page_load($http, $scope, $location.path());


    var read = "#read";

    $scope.searchFilter = {};
    $scope.tip = "Search";
  
    $scope.isSearchOpen = false;

    $scope.user_t = { user_first : "", user_second : ""};

    $scope.cached_translations = {};
    $scope.blocked_translations = {};
    $scope.saved_translations = {};

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
        }, function ( response ) {
            // TODO: handle the error somehow
        }).finally(function() {
            // called no matter success or failure
            // $scope.loading = false;
        });
    }   
  
    $scope.toggleSearch = function() {
        $scope.isSearchOpen = !$scope.isSearchOpen;
    }

    $scope.is_showing = function(qasida_number, line_number, user) {
      if (typeof(user) == 'undefined') { return $scope.show_translation == $scope.current_lang+"_"+qasida_number+"_"+line_number;}
      else {return $scope.show_user_input == $scope.current_lang+"_"+qasida_number+"_"+line_number;}
    }

    $scope.removeUserTranslations = function(qasida_number, line_number) {
        
        $scope.show_translation = "";
    }

    $scope.get_translation = function(translation_id, qasida_number, line_number) {
      var key = $scope.current_lang+"_"+qasida_number+"_"+line_number;
      
      var translations = $scope.cached_translations[key];
      for (var i =0; i < translations.length; i++) {
        var translation = translations[i];
        if (translation_id === translations[i]['translation_id']) {break;}
      }

      return translation;
    }

    $scope.__save_translation = function(translation_id, qasida_number, line_number, is_up) {

      if ($scope.blocked_translations.hasOwnProperty($scope.key)) {
        return false;
      }

      var vote = 0;
      var translation = $scope.get_translation(translation_id, qasida_number, line_number);


      is_up == 1 ? vote = parseInt(translation['num_up_votes']) + 1 : vote = parseInt(translation['num_down_votes']) + 1
      
      $scope.save_translation(translation_id, is_up, vote, qasida_number, line_number);

    }

    $scope.voteUp = function(translation_id, qasida_number, line_number) {
      $scope.__save_translation(translation_id, qasida_number, line_number, 1);
    }

    $scope.voteDown = function(translation_id, qasida_number, line_number) {
        $scope.__save_translation(translation_id, qasida_number, line_number, 0);
    }

    $scope.save_translation = function(translation_id, is_up, vote, qasida_number, line_number) {
      var path1 = "/dynamo/update/"+$scope.current_lang+"/";
      var path2 = encodeURI(translation_id);
      var path3 = "/"+is_up+"/"+vote;

      var path = path1+path2+path3;

      $http({
          url      : path,
          method   : 'GET',
          headers : { 'X-Requested-With' :'XMLHttpRequest'}
      })
      .then(function(response) {                
        var translation = response.data['data'];
        
        for (var i=0;i<$scope.translations.length;i++) {
            if ($scope.translations[i]['translation_id'] === translation_id) {$scope.translations[i] = translation;}
          
        }
        for (var i=0;i<$scope.cached_translations.length;i++) {
            if ($scope.cached_translations[i]['translation_id'] === translation_id) {$scope.cached_translations[i] = translation;}
          
        }
        $scope.blocked_translations[$scope.key] = true;
        
      }, function ( response ) {
          // TODO: handle the error somehow
      }).finally(function() {
          
      });
    }

    $scope.getUserTranslations = function(qasida_number, line_number) {
      $scope.key = $scope.current_lang+"_"+qasida_number+"_"+line_number;
      $scope.show_translation = $scope.key;
        

        if (!$scope.cached_translations.hasOwnProperty($scope.key)) {
            var path = "/dynamo/scan/"+$scope.current_lang+"/"+encodeURI(qasida_number)+"/"+encodeURI(line_number);
            $http({
                url      : path,
                method   : 'GET',
                headers : { 'X-Requested-With' :'XMLHttpRequest'}
            })
            .then(function(response) {
                
                $scope.translations = response.data['data'];
                $scope.cached_translations[$scope.key] = response.data['data'];
                
            }, function ( response ) {
                // TODO: handle the error somehow
            }).finally(function() {
                // called no matter success or failure
                // $scope.loading = false;


            });
        } else {
            $scope.translations = $scope.cached_translations[$scope.key];
            // $scope.show_translations = $scope.key;
            // $scope.loading = false;
        }
    }

    $scope.closeUserInput = function() {
      $scope.user_t.user_first = "";
      $scope.user_t.user_second = "";
      $scope.show_user_input = "";
    }

    $scope.showUserInput = function(qasida_number, line_number) {
      $scope.show_user_input = $scope.current_lang+"_"+qasida_number+"_"+line_number;
    }

    $scope.saveUserTranslation = function(qasida_number, line_number) {

      if ($scope.user_t.user_first && $scope.user_t.user_second) {
          var path1 = "/dynamo/add/"+$scope.current_lang+"/";
          var path2 = qasida_number+"/"+line_number+"/";
          var path3 = encodeURI($scope.user_t.user_first)+"/"+encodeURI($scope.user_t.user_second);
          
          var path = path1+path2+path3;
          $http({
                url      : path,
                method   : 'GET',
                headers : { 'X-Requested-With' :'XMLHttpRequest'}
            })
            .then(function(response) {
                $scope.user_t.user_first = "";
                $scope.user_t.user_second = "";
                $scope.translations.unshift(response.data['data'])
                if ($scope.translations.length > 3) {$scope.translations.pop();}
                
            }, function ( response ) {
                // TODO: handle the error somehow
            }).finally(function() {
                // called no matter success or failure
                // $scope.loading = false;


            });

      }
    }
});

angular.module('sharabelwasl')
  .decorator('lxSearchFilterDirective', function($delegate){
    
    $delegate[0].scope.isOpen = '=';
  
    console.log($delegate[0].scope);
  
    var originalLinkFn = $delegate[0].link;
  
    $delegate[0].compile = function(tElem, tAttr) {
      return function newLinkFn(scope, element, attrs, ctrl, transclude) {
        originalLinkFn.apply($delegate[0], arguments);
      
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

angular.module('sharabelwasl')
  .directive('loading',   ['$http' ,function ($http)
    {
      return {
        restrict: 'A',
        link: function ($scope, elm, attrs) {
          $scope.isLoading = function () {
              return $http.pendingRequests.length > 0;
          };

          $scope.$watch($scope.isLoading, function (v) {
            if(v){
              if ($scope.key == elm.attr('id')){elm.addClass('loading')};
            }else{
              if ($scope.key == elm.attr('id')){setTimeout(function(){elm.removeClass('loading');}, 100)}
            }
          });


        }
      };

}]);
