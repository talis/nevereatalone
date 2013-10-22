'use strict';

/* Controllers */

angular.module('neverEatAloneApp.controllers', []).
	controller('HomeController', function($scope, angularFire,angularFireCollection, angularFireAuth, Login, version, db_url) {
		// The following line should not be used - we need to persist the user on a page refresh
		Login.twitter();
		$scope.login = Login;
		$scope.events = {};

		var ref = new Firebase(db_url+'/events');
		angularFire(ref, $scope, 'events');

	}).
	controller('EventController', function(){
		console.log('event controller');
	}).
	controller('CreateEventController', function($scope, $location, angularFire, angularFireCollection, angularFireAuth, Login, Skills, db_url){
		Login.twitter();
		// Load up all skills we have listed
		Skills.load($scope);
		$scope.events = {'saveValue':{}};


		$scope.createEvent = function(){

			console.log(this.description);

			var eventobj = {
				description:this.description,
				skills:new Array()
			};

			for(var i in this.events.saveValue){
				if(this.events.saveValue[i] == true){
					eventobj.skills.push(i);
				}
			}

			var ref = new Firebase(db_url+'/events/');
			
			var newEvent = ref.push({
				description:(eventobj.description !== undefined ? eventobj.description : ''),
				skills: eventobj.skills
			})
			$location.path('/event/'+newEvent.name());
		};
	}).
	
	controller('ProfileController', function($scope, showSkillsFilter, angularFire,angularFireCollection, angularFireAuth, Login, Skills, version, db_url) {
		// The following line should not be used - we need to persist the user on a page refresh
		Login.twitter();
		$scope.login = Login;
		Skills.load($scope);




		$scope.save = function(){
			var userobj = {
				description:this.profile.description,
				skills:new Array()
			};

			for(var i in this.profile.saveValue){
				if(this.profile.saveValue[i] == true){
					var ref = new Firebase(db_url+'/skills/'+i);
					ref.push($scope.user.uid);


					userobj.skills.push(i);
				}
			}

			var ref = new Firebase(db_url+'/profile/'+$scope.user.uid);
			ref.update({
				'description':userobj.description,
				'skills':userobj.skills
			});
		}
	});