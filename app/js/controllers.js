'use strict';

/* Controllers */

angular.module('neverEatAloneApp.controllers', []).
	controller('HomeController', function($scope, angularFire, Login, version, db_url) {
		$scope.login = Login;
	});