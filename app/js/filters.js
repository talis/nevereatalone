'use strict';

/* Filters */

angular.module('neverEatAloneApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('keyCount', function(){
    return function(input){
      return Object.keys(input).length;
    }
  }).
  filter('showSkills', function(){
  	return function(input){
  		if(input == undefined){
  			return null;
  		}
  		var matrix = {};
  		for(var i in input){
  			if(matrix[Object.keys(input[i])] == undefined){
  				matrix[Object.keys(input[i])] = new Array();
  			}
  			matrix[Object.keys(input[i])].push(input[i][Object.keys(input[i])]);
  		}
  		return matrix;
  	}
  });
