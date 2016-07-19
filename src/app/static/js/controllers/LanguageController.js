/**
 * @ngdoc function
 * @name sharabelwasl.controller:LanguageController
 * @description
 * # LanguageController
 * Common application controller
 */
 
angular.module('sharabelwasl').controller('LanguageController', function(LanguageSelectService) {
	var vm = this;

	vm.currentLocaleDisplayName = LanguageSelectService.getLocaleDisplayName();
    vm.localesDisplayNames = LanguageSelectService.getLocalesDisplayNames();
    
    vm.changeLanguage = function (locale) {
      LanguageSelectService.setLocaleByDisplayName(locale);
    };
    
});