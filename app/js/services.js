'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('neverEatAloneApp.services', []).
  value('version', '0.1').
  value('db_url', 'https://nevereatalone.firebaseio.com');

angular.module('neverEatAloneApp')
	.factory('Events', function _factory($location, angularFireCollection, db_url){
		return {
			join:function($scope, eventId){
				// Get event
				var ref = new Firebase(db_url+'/events/'+eventId);
				angularFireCollection(ref);
				ref.once('value', function(data){
					var evnt = data.val();
			
					// Delete out all other invites
					for(var i in evnt.invites){
						if(evnt.invites[i] != $scope.user.uid){
							ref = new Firebase(db_url+'/profile/'+evnt.invites[i]+'/invites/'+eventId);
							ref.child('active').set(false);
						}
					}
					// Update the event to show you are attending
					ref = new Firebase(db_url+'/events/'+eventId);
					ref.child('attendee_uid').set($scope.user.uid);
					ref.child('attendee_name').set($scope.user.name);
					$location.path('/');
				});
			},
			leave:function($scope, eventId){
				// Get event
				var ref = new Firebase(db_url+'/events/'+eventId);
				angularFireCollection(ref);
				ref.once('value', function(data){
					var evnt = data.val();
			
					// Delete out all other invites
					for(var i in evnt.invites){
						if(evnt.invites[i] == $scope.user.uid){
							ref = new Firebase(db_url+'/profile/'+evnt.invites[i]+'/invites/'+eventId);
							ref.remove();
						} else{
							ref = new Firebase(db_url+'/profile/'+evnt.invites[i]+'/invites/'+eventId);
							ref.child('active').set(true);
						}
					}
					// Update the event to show you are attending
					ref = new Firebase(db_url+'/events/'+eventId+'/attendee_uid');
					ref.remove();
					ref = new Firebase(db_url+'/events/'+eventId+'/attendee_name');
					ref.remove();
					$location.path('/');
				});
			}
		}
	})
	.factory('Skills', function _factory(angularFireAuth, angularFireCollection, showSkillsFilter, db_url){
		return {
			load:function($scope, loadIntoSaveValue){
				
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
									if(loadIntoSaveValue == true){
										$scope.saveValueOn[data.val().skills[i]] = true;
									}
								}
							}
						});
					}
				});
			}
		}
	})
	.factory('Login', function _factory($rootScope, $location, $cookies, angularFireAuth, db_url){
		return {
			login:function(){

				switch($cookies.provider){
					case 'twitter':
						this.twitter();
						break;
					case 'github':
						this.github();
						break;
				}
			},
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
							$cookies.provider = 'github';
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
						$cookies.provider = 'twitter';
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
				$cookies.provider = '';
				delete $cookies.provider;
				delete $cookies['provider'];

				$location.path('/logout');
			}
		}
	});