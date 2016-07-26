/**
 * @ngdoc function
 * @name sharabelwasl.controller:ReadController
 * @description
 * # ReadController
 * Common application controller
 */

angular.module('sharabelwasl')
  .controller('ReadController', function($scope, $state, $qasidas) {

  	var vm = $scope; vm._q = 0; vm._v = 0;
  	vm.qasidas = $qasidas.items();

  	
  	vm.back_to_search = function() {
      $state.go("main");
    }
    
  });