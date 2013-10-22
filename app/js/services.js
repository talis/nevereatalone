'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('neverEatAloneApp.services', []).
  value('version', '0.1').
  value('db_url', 'https://nevereatalone.firebaseio.com');

angular.module('neverEatAloneApp')
	.factory('Skills', function _factory(angularFireAuth, angularFireCollection, showSkillsFilter, db_url){
		return {
			load:function($scope){
				
				$scope.profile = {'skillsMatrix':{},'saveValue':{},'description':''};

				$scope.$watch('user', function(user){
					if($scope.user !== undefined){
						// Get all skills
						var ref = new Firebase(db_url+'/skill_sets');
						var skills = angularFireCollection(ref);
						ref.on('value', function(data){
							var matrix = {};
					  		for(var i in data.val()){
					  			if(matrix[Object.keys(data.val()[i])] == undefined){
					  				matrix[Object.keys(data.val()[i])] = new Array();
					  			}
					  			matrix[Object.keys(data.val()[i])].push(data.val()[i][Object.keys(data.val()[i])]);
					  		}

							$scope.profile.skillsMatrix = matrix;
						});
						
						var ref = new Firebase(db_url+'/profile/'+$scope.user.uid);
						ref.on('value', function(data){
							// console.log(data.val());
							if(data.val() !== null){
								$scope.profile.description = data.val().description;
								for(var i in data.val().skills){
									$scope.profile.saveValue[data.val().skills[i]] = true;
								}
							}
						});
					}
				});
			}
		}
	})
	.factory('Login', function _factory($rootScope, $location, angularFireAuth, db_url){
		return {
			github:function(){
				var ref = new Firebase(db_url);
				var auth = new FirebaseSimpleLogin(ref, function(error, user){
					if(user){
						$rootScope.$apply(function(){ 
							$rootScope.user = {
								uid:user.uid,
								username:user.username,
								name:user.displayName,
								avatar:user.avatar_url
							};
						});
					} else if(error){
					} else{
						this.login('github', {
							rememberMe:true
						});
					}
				});
			},
			twitter:function(){
				var ref = new Firebase(db_url);
				var auth = new FirebaseSimpleLogin(ref, function(error, user){
					if(user){
						$rootScope.$apply(function(){
							$rootScope.user = {
								uid:user.uid,
								username:user.username,
								name:user.displayName,
								avatar:user.profile_image_url
							};
						});
					} else if(error){
					} else{
						this.login('twitter', {
							rememberMe:true
						});
					}
				});
			},
			logout:function(){
				
				// This doesnt always work - fix this - seems to be working a bit better now
				var ref = new Firebase(db_url);
				var auth = new FirebaseSimpleLogin(ref, function(error, user){

				});
				auth.logout();
				$rootScope.user = null;
				$location.path('/logout');
			}
		}
	});