'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('neverEatAloneApp.services', []).
  value('version', '0.1').
  value('db_url', 'https://nevereatalone.firebaseio.com');

angular.module('neverEatAloneApp')
	.factory('Login', function _factory($rootScope, angularFireAuth){
		return {
			github:function(){
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

				angularFireAuth.initialize(ref, {scope: $rootScope, name: "user", callback:function(err,user){
					
				}});
				
				
				if($rootScope.user == undefined){
					angularFireAuth.login('twitter', {rememberMe:true});
				}
			},
			logout:function(){
				var ref = new Firebase('https://nevereatalone.firebaseio.com');

				// console.log(angularFireAuth._loggedIn());
				angularFireAuth.initialize(ref, {scope: $rootScope, name: "user", callback:function(err,user){
					console.log(err);
					console.log(user);
				}});
				angularFireAuth.logout();
			}
		}
	})

	.factory('Logout', function _factory($rootScope, angularFireAuth){
		return {
			logout:function(){
				var ref = new Firebase('https://nevereatalone.firebaseio.com');

				// console.log(angularFireAuth._loggedIn());
				angularFireAuth.initialize(ref, {scope: $rootScope, name: "user", callback:function(err,user){
					console.log(err);
					console.log(user);
				}});
				angularFireAuth.logout();
			}
		}
	});