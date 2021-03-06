angular.module("puzzle.followers",['ui.router', 'ui.state'])

.config(function($stateProvider){
	$stateProvider.state('followers', {
				url: '/:handle/followers',
				templateUrl: "followers/followers.tpl.html",
				controller: "FollowersController",
				data: { pageTitle: "followers" }
	});
})

.factory('followersFactory', function($q, $http){
	var user = {
		name: "",
		followers: []
	};
	return {
		fetchFollowers: function(handle){
			$http.get("/" + handle + "/followers").success(function(response){
				user.name = handle;
				user.followers = response;
			}).error(function(){});
		},
		getUser: function(){
			return user;
		}
	};	
})

.controller("FollowersController", function($scope, $state, $stateParams, followersFactory){
	followersFactory.fetchFollowers($stateParams.handle);
	$scope.user = followersFactory.getUser();
})

.directive("selectHandle", function($state){
	return {
		restrict: 'E',
		scope: {},
		template: '<input type="text" ng-model="handle"></input><button ng-click="showFollowers(handle)">Change</button>',
		controller: function($scope){
			$scope.showFollowers = function(handle){
				$state.transitionTo('followers', {handle: handle});
			};
		}
	};
})
;