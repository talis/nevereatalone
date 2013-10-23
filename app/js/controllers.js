'use strict';

/* Controllers */

angular.module('neverEatAloneApp.controllers', []).
	controller('HomeController', function($scope, $cookies, angularFire,angularFireCollection, angularFireAuth, Login, Events, version, db_url) {
		// The following line should not be used - we need to persist the user on a page refresh
		// console.log($cookies.provider);
		Login.login();

		// Login.twitter();
		$scope.login = Login;
		$scope.events = {};
		$scope.invites = {};

		$scope.$watch('user', function(user){
			if($scope.user !== undefined && $scope.user != null && $scope.user.uid !== null){
				var eventRef, inviteEventRef,
					ref = new Firebase(db_url+'/profile/'+$scope.user.uid+'/events'),
					inviteRef = new Firebase(db_url+'/profile/'+$scope.user.uid+'/invites');
				angularFireCollection(ref);
				angularFireCollection(inviteRef);
				ref.on('value', function(data){
					for(var i in data.val()){
						eventRef = new Firebase(db_url+'/events/'+i);
						angularFireCollection(eventRef);
						eventRef.on('value', function(eventData){
							$scope.events[eventData.name()] = eventData.val();
						});
					}
					
				});
				inviteRef.on('value', function(data){
					$scope.invites = {};
					for(var i in data.val()){

						if(data.val()[i].active == true){

							inviteEventRef = new Firebase(db_url+'/events/'+i);
							angularFireCollection(inviteEventRef);
							inviteEventRef.on('value', function(eventData){
								$scope.invites[eventData.name()] = eventData.val();
							});
						}
					}
					
				});
			}
		});

		$scope.join = function(eventId){
			Events.join($scope, eventId);
			// console.log(eventId);
		}

	}).

	controller('InviteController', function($scope, $location, $routeParams, angularFire, angularFireCollection, angularFireAuth, Login, Events, version, db_url){
		Login.login();
		$scope.login = Login;

		var inviteRef, ref = new Firebase(db_url+'/events/'+$routeParams.eventId);
		angularFireCollection(ref);
		ref.once('value', function(data){
			// Check we have a valid invitation
			inviteRef = new Firebase(db_url+'/profile/'+$scope.user.uid+'/invites/'+$routeParams.eventId);
			angularFireCollection(inviteRef);
			inviteRef.once('value', function(inviteData){
				if(inviteData.val() != null && inviteData.val().active == true){
					$scope.event = data.val();
				} else{
					$location.path('/');
				}
			});
		});

		$scope.join = function(){
			Events.join($scope, $routeParams.eventId);
		}
		$scope.leave = function(){
			Events.leave($scope, $routeParams.eventId);
		}
	}).

	controller('EventController', function($scope, $location, $routeParams, angularFire, angularFireCollection, angularFireAuth, Login, version, db_url){
		
		Login.login();
		$scope.login = Login;

		// Get event information
		var ref = new Firebase(db_url+'/events/'+$routeParams.eventId);
		angularFireCollection(ref);
		ref.on('value', function(data){
			$scope.event = data.val();

			// Get the user profile
			var profileRef = new Firebase(db_url+'/profile/'+data.val().attendee_uid);
			angularFireCollection(profileRef);
			profileRef.once('value', function(profileData){
				$scope.event.attendee = profileData.val();
			});
		});

		$scope.cancel = function(evnt){
			var ref = new Firebase(db_url+'/events/'+$routeParams.eventId);
			ref.remove();
			ref = new Firebase(db_url+'/profile/'+$scope.user.uid+'/events/'+$routeParams.eventId);
			ref.remove();

			// Remove invites
			for(var i in evnt.invites){				
				ref = new Firebase(db_url+'/profile/'+evnt.invites[i]+'/invites/'+$routeParams.eventId);
				ref.remove();
			}
			$location.path('/');
		}
		$scope.save = function(evnt){
			var ref = new Firebase(db_url+'/events/'+$routeParams.eventId);
			ref.update(evnt);
		}
		$scope.rateup = function(evnt){
			var ref = new Firebase(db_url+'/profile/'+evnt.attendee_uid+'/rating');
			var newRating = 0;
			ref.on('value', function(data){
				if(data.val() != undefined){
					newRating = data.val() + 1;
				} else{
					newRating = 1;
				}
			});
			ref.set(newRating);

			// Mark event as rated
			ref = new Firebase(db_url+'/events/'+$routeParams.eventId+'/rated');
			ref.set(true);
		}
		$scope.ratedown = function(evnt){
			var ref = new Firebase(db_url+'/profile/'+evnt.attendee_uid+'/rating');
			var newRating = 0;
			ref.on('value', function(data){
				if(data.val() != undefined){
					newRating = data.val() - 1;
				} else{
					newRating = -1;
				}
			});
			ref.set(newRating);
			ref = new Firebase(db_url+'/events/'+$routeParams.eventId+'/rated');
			ref.set(true);
		}
	}).


	controller('CreateEventController', function($scope, $location, angularFire, angularFireCollection, angularFireAuth, Login, Skills, db_url){
		Login.login();
		// Load up all skills we have listed
		$scope.saveValueOn = {};
		Skills.load($scope, false);

		$scope.events = {'saveValue':{}};

		$scope.addSkill = function(val){
			$scope.saveValueOn[val] = true;
		};
		$scope.removeSkill = function(val){
			delete $scope.saveValueOn[val];
		}

		$scope.createEvent = function(){

			var newEvent, newEventRef, ref, invites = new Array(), 
				eventobj = {
				description:this.description,
				location:this.location,
				when:this.when,
				skills:new Array()
			};

			for(var i in $scope.saveValueOn){
				if($scope.saveValueOn[i] == true){
					eventobj.skills.push(i);
				}
			}

			newEventRef = new Firebase(db_url+'/events/');
			newEvent = newEventRef.push({
				description:(eventobj.description !== undefined ? eventobj.description : ''),
				when:(eventobj.when !== undefined ? eventobj.when : ''),
				location:(eventobj.location !== undefined ? eventobj.location : ''),
				skills: eventobj.skills,
				uid:$scope.user.uid
			});

			// Push into user profile object
			ref = new Firebase(db_url+'/profile/'+$scope.user.uid+'/events/'+newEvent.name());
			ref.set({'active':true});

			// Skill search - invite users
			for(i in eventobj.skills){
				ref = new Firebase(db_url+'/skills/'+eventobj.skills[i]);
				angularFireCollection(ref);
				ref.once('value', function(data){
					for(i in data.val()){
						if(data.val()[i] != $scope.user.uid){
							invites.push(data.val()[i]);
							ref = new Firebase(db_url+'/profile/'+data.val()[i]+'/invites/'+newEvent.name());
							ref.set({'active':true});
						}
					}

					newEventRef = new Firebase(db_url+'/events/'+newEvent.name()+'/');
					newEventRef.child('invites').set(invites);
				});
			}
			$location.path('/');
		};
	}).
	
	controller('ProfileController', function($scope, showSkillsFilter, angularFire,angularFireCollection, angularFireAuth, Login, Skills, version, db_url) {
		// The following line should not be used - we need to persist the user on a page refresh
		Login.login();
		$scope.login = Login;
		$scope.saveValueOn = {};
		Skills.load($scope, true);


		$scope.addSkill = function(val){
			$scope.saveValueOn[val] = true;
		};
		$scope.removeSkill = function(val){
			delete $scope.saveValueOn[val];
		}

		$scope.save = function(){

			var userobj = {
				description:this.profile.description,
				skills:new Array()
			};

			for(var i in $scope.saveValueOn){
				if($scope.saveValueOn[i] == true){
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