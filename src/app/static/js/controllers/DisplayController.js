/**
 * @ngdoc function
 * @name sharabelwasl.controller:DisplayController
 * @description
 * # DisplayController
 * Common application controller
 */
var sharabelwasl = angular.module('sharabelwasl');

angular.module('sharabelwasl').controller('DisplayController', function($window, $scope, $location, $anchorScroll) {

        $scope.ids = ["search", "read", "extra", "what"];
        

        $scope.moveToSection = function() {

            $scope.moved = false;
            var windowHeight = angular.element($window).height();

            for (key in $scope.ids) {
            
                var section = document.getElementById($scope.ids[key]);
                var position = section.getBoundingClientRect().top;

                
                if (section.id == "search" && position > $scope.getMarker()) {
                    $scope.scrollingUp = true;
                } else if (section.id == "search" && position < $scope.getMarker()) {
                    $scope.scrollingUp = false;
                }
                
                if (position > 0 && position < windowHeight && !$scope.scrollingUp) {   
                    // $('html,body').animate({scrollTop: $("#"+section.id+"").offset().top},'slow'); 
                    return;
                } else if (position > 0 && $scope.scrollingUp) {
                    // $('html,body').animate({scrollTop: $("#"+$scope.ids[key-1]+"").offset().top},'slow');
                    return;
                }
            }

        }

        $scope.setMarker = function() {
            $scope.searchPosition = angular.element("section")[0].getBoundingClientRect().top;
        }

        $scope.getMarker = function() {
            return $scope.searchPosition;
        }

        $scope.scroll = function() {
            $scope.moveToSection();
            $scope.setMarker();
        }
  });