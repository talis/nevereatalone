'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('neverEatAloneApp.services', []).
  value('version', '0.1').
  value('db_url', 'https://nevereatalone.firebaseio.com');

angular.module('neverEatAloneApp')
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