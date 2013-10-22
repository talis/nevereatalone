'use strict';

/* Controllers */

angular.module('neverEatAloneApp.controllers', []).
	controller('HomeController', function($scope, angularFire, angularFireAuth, Login, version, db_url) {
		$scope.login = Login;
	}).
	controller('ProfileController', function($scope, angularFire, angularFireAuth, Login, version, db_url) {
		$scope.login = Login;
	});