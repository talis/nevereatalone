'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('neverEatAloneApp.services', []).
  value('version', '0.1').
  value('db_url', 'https://nevereatalone.firebaseio.com');

angular.module('neverEatAloneApp')
	.factory('Login', function _factory($rootScope, $location, angularFireAuth){
		return {
			github:function(){
				// Refactor this code to look more like the twitter method
				var ref = new Firebase('https://nevereatalone.firebaseio.com');
				var auth = new FirebaseSimpleLogin(ref, function(error, user) {
					if(user){
						$rootScope.$apply(function(){ 
							$rootScope.user = user;
						});
					} else if(error){
					}
				});
				auth.login('github', {rememberMe:true});
			},
			twitter:function(){
				var ref = new Firebase('https://nevereatalone.firebaseio.com');
				var auth = new FirebaseSimpleLogin(ref, function(error, user){
					if(user){
						$rootScope.$apply(function(){ 
							// console.log(user);
							$rootScope.user = {
								id:user.id,
								username:user.username,
								name:user.displayName
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
				// This doesnt always work - fix this
				var ref = new Firebase('https://nevereatalone.firebaseio.com');
				var auth = new FirebaseSimpleLogin(ref, function(error, user){

				});
				auth.logout();
				$rootScope.user = null;
				$location.path('/');
			}
		}
	});