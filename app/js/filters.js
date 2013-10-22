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
		return user.name;
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
  }).
  filter('showSkills', function(){
  	return function(input){
  		if(input == undefined){
  			return null;
  		}
  		var matrix = {};

// console.log(input);

  		for(var i in input){

  			// console.log(Object.keys(input[i]));

  			if(matrix[Object.keys(input[i])] == undefined){
  				matrix[Object.keys(input[i])] = new Array();
  			}
  			matrix[Object.keys(input[i])].push(input[i][Object.keys(input[i])]);
  		}
  		return matrix;
  	}
  });
