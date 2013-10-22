'use strict';

/* Filters */

angular.module('neverEatAloneApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('showName', function(){
	return function(user){
		if(user == undefined){
			return false;
		}
		switch(user.provider){
			case 'twitter':
				return user.name;
			case 'github':
				return user.displayName;
		}
	};
  }).
  filter('showAvatar', function(){
  	return function(user){
		if(user == undefined){
			return false;
		}
		switch(user.provider){
			case 'twitter':
				return user.name;
			case 'github':
				return user.avatar_url;
		}
	};
  });
