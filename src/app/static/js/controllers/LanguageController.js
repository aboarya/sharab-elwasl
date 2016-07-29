/**
 * @ngdoc function
 * @name sharabelwasl.controller:LanguageController
 * @description
 * # LanguageController
 * Common application controller
 */
 
angular.module('sharabelwasl').controller('LanguageController', function($state, LanguageSelectService) {
	var vm = this;

	vm.currentLocaleDisplayName = LanguageSelectService.getLocaleDisplayName();
    vm.localesDisplayNames = LanguageSelectService.getLocalesDisplayNames();
    
    vm.changeLanguage = function (locale) {
    	
    	if (locale == 'العربيه') {
    	
    		document.getElementById("search_text").dir = "rtl";
    	} else {
    		document.getElementById("search_text").dir = "ltr";
    	}
    	
		LanguageSelectService.setLocaleByDisplayName(locale);
		
    };
    
});