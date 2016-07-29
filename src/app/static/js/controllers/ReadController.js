/**
 * @ngdoc function
 * @name sharabelwasl.controller:ReadController
 * @description
 * # ReadController
 * Common application controller
 */

angular.module('sharabelwasl')
  .controller('ReadController', function($sce, $scope, $state, $stateParams, $qasidas, $terms) {

  	
  	var vm = $scope; vm._q = 0; vm._v = 0;
  	var CHARCODE_SHADDA = 1617;
		var CHARCODE_SUKOON = 1618;
		var CHARCODE_SUPERSCRIPT_ALIF = 1648;
		var CHARCODE_TATWEEL = 1600;
		var CHARCODE_ALIF = 1575;

  	vm.qasidas = $qasidas.items();
  	vm.search = $terms.items();
    vm.width = ''+(100 / vm.qasidas.length)+'%;';
    

    vm.set = function(n) {
      vm._q = n;
    }
    vm.range = function(count) {

      return new Array(count);
    }

  	
  	vm.back_to_search = function() {
      $state.go("main");
    }

    vm.highlight = function(text, search) {

    	if (!search) {
        	return $sce.trustAsHtml(text);
    	}
    	var verse = text.split(' ');
    	var terms = [];
    	search.includes(" ") ? terms = search.split(" ") : terms = [search];
    	for (var i =0;i < verse.length;i++) {
    		for (var j=0; j < terms.length; j++) {
    			if (vm.strip_accent(verse[i]) == terms[j]) {
    				verse[i] = '<span class="highlightedText">'+verse[i]+'</span>';
    			}	
    		}
    		
    	}	
    	var html = verse.join(" ");
    	return $sce.trustAsHtml(html);
		};

		vm.is_accented  = function(letter) {
    	if (typeof(letter) == "undefined" || letter == null)
        return false;

    	var code = letter.charCodeAt(0);
    
    	return (code == CHARCODE_TATWEEL || code == CHARCODE_SUPERSCRIPT_ALIF || code >= 1612 && code <= 1631); //tashkeel
		};

		vm.strip_accent = function(input) {
  		var output = "";
  		//todo consider using a stringbuilder to improve performance
  		for (var i = 0; i < input.length; i++) {
    		var letter = input.charAt(i);
    		if 	(!vm.is_accented(letter)) //tashkeel
      		output += letter;                                
  			}
				return output;
			};
    
  });