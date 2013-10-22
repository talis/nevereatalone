'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('neverEatAloneApp.services', []).
  value('version', '0.1').
  value('db_url', 'https://nevereatalone.firebaseio.com');

angular.module('neverEatAloneApp')
	.factory('Login', function _factory($rootScope){
		return {
			github:function(){
				console.log('logging in through github');
			},
			twitter:function(){


				var ref = new Firebase('https://nevereatalone.firebaseio.com');
				var auth = new FirebaseSimpleLogin(ref, function(error, user) {
					if(user){
						$rootScope.$apply(function(){ 
							$rootScope.user = user;
						});
					} else if(error){
					}
				});
				auth.login('twitter', {rememberMe:true});
			}
		}
	})

	.factory('Logout', function _factory($rootScope){
		return {
			logout:function(){
				$rootScope.user = {};
			}
		}
	});