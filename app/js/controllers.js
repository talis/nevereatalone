'use strict';

/* Controllers */

angular.module('neverEatAloneApp.controllers', []).
	controller('HomeController', function($scope, angularFire,angularFireCollection, angularFireAuth, Login, version, db_url) {
		// Call the right login provider
		Login.twitter();
		$scope.login = Login;

	}).
	controller('ProfileController', function($scope, showSkillsFilter, angularFire,angularFireCollection, angularFireAuth, Login, version, db_url) {
		// Call the right login provider
		Login.twitter();
		$scope.login = Login;
		$scope.saveValue = {};
		$scope.skillsMatrix = {};
		

		$scope.$watch('user', function(user){
			if($scope.user !== undefined){
				// Get all skills
				var ref = new Firebase(db_url+'/skill_sets');
				var skills = angularFireCollection(ref);
				ref.on('value', function(data){
					$scope.skillsMatrix = showSkillsFilter(data.val());
				});
				// Get user profile
				var ref = new Firebase(db_url+'/profile/'+$scope.user.username);
				ref.on('value', function(data){
					$scope.description = data.val().description;
					for(var i in data.val().skills){
						$scope.saveValue[data.val().skills[i]] = true;
					}
				});
				$scope.profile = angularFireCollection(ref);
			}
		})

		$scope.save = function(){
			var userobj = {
				description:this.description,
				skills:new Array()
			};

			for(var i in this.saveValue){
				if(this.saveValue[i] == true){
					userobj.skills.push(i);
				}
			}
			var ref = new Firebase(db_url+'/profile/'+$scope.user.username);
			ref.update({
				'description':userobj.description,
				'skills':userobj.skills
			});
		}
	});