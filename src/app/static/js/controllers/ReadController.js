/**
 * @ngdoc function
 * @name sharabelwasl.controller:ReadController
 * @description
 * # ReadController
 * Common application controller
 */

angular.module('sharabelwasl')
  .controller('ReadController', function($scope, $state, $qasidas) {

  	$scope.index = 0;

  	//  $scope.v = 0;
  	// $scope.qasidas = $qasidas.items();

  	// var x = "";
  	// vm.back_to_search = function() {
   //    vm.query.term = "";
   //    angular.element(document).find("html").addClass("loading");
   //    vm.query.template_url = '/partial/search-section';
   //    setTimeout(function() {
   //      angular.element(document).find("html").addClass("full");
   //      angular.element(document).find("html").removeClass('loading');
   //      }, 250);
      
      
   //  }

   //  vm.check_better_translation = function(verse) {
      
   //    vm.verse = verse;
      
   //    var verse_key = vm.verse[vm.lang_first].replace(' ','_')+"_"+vm.verse[vm.lang_second].replace(' ','_');
   //    if (vm.cached_verses.indexOf(verse_key) == -1) {

   //      vm.cached_verses.push(verse_key);
   //      var line = vm.verse['line_number']; var number = vm.verse['qasida_number'];
   //      var path = "/dynamo/scan/"+vm.get_current_lang()+"/"+number+"/"+line;
   //      vm.ajax(path, vm.check_better_translation_callback);  
   //    }

   //  }

   //  vm.check_better_translation_callback = function(data) {
   //    if (vm.get_current_lang() == 'ar') {return;}
   //    if (data.hasOwnProperty("qasida_number")) {
   //      vm.qasidas[vm.current_qasida][1][vm.current_verse] = data;
   //    }
   //  }


    
  });