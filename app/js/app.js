'use strict';


// Declare app level module which depends on filters, and services
angular.module('neverEatAloneApp', [
  'ngRoute',
  'neverEatAloneApp.filters',
  'neverEatAloneApp.services',
  'neverEatAloneApp.directives',
  'neverEatAloneApp.controllers',
  'firebase'
 ]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeController'});
  $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller:'ProfileController'});
  $routeProvider.when('/create', {templateUrl: 'partials/create.html', controller:'CreateEventController'});
  $routeProvider.when('/event/:eventId', {templateUrl: 'partials/event.html', controller:'EventController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);