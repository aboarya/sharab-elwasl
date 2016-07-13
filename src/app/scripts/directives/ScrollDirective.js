/**
 * @ngdoc function
 * @name sharabelwasl.directive:ScrollDirective
 * @description
 * # ScrollDirective
 * Directive to capture page scrolls and determine reader content
 */
var sharabelwasl = angular.module('sharabelwasl');

angular.module('sharabelwasl')
  .directive("scroll", function ($window) {
    return function($scope, element, attrs) {
        $(window).scroll(function() {

        	clearTimeout($scope._scrollTimer);
            
        	$scope._scrollTimer = setTimeout(function() {
                if (!$scope.scrolled) {
                    
                    $scope.scroll();
                    // $scope.scrolled = !$scope.scrolled;
                }
        	}, 250);
        });
    }
});