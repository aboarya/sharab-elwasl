/**
 * @ngdoc function
 * @name sharabelwasl.factory:QueryService
 * @description
 * # QueryService
 * Service for setting/getting current locale
 */
 
angular.module('sharabelwasl')
  .service('es', function (esFactory) {
  	return esFactory({ host: 'localhost:9200' });
});
