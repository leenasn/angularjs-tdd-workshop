describe("Follwers", function(){
	var scope, controller, templateCache, location;
	beforeEach( module("puzzle.followers", "followers/followers.tpl.html") );
	beforeEach(inject(function($rootScope, $controller, $templateCache, $location){
		scope = $rootScope.$new();
		controller = $controller;
		templateCache = $templateCache;
		location = $location;
	}));

	it("should accept the follwers twitter handle", inject(function($state){
		expect(function(){
			$state.transitionTo('followers', {handle: 'testHandle'});
		}).not.toThrow();
		scope.$apply();
		expect($state.current.controller).toBe("FollowersController");
	}));
	describe("fetch followers", function(){
		var response, handle, url;
		beforeEach(function(){
			response = ['firefox','chrome'];
			handle = 'twitter'; 
			url = "/" + handle + "/followers";
		});
		it("should fetch the followers", inject(function(followersFactory, $httpBackend){
			$httpBackend.expectGET(url).respond(response);
			followersFactory.fetchFollowers(handle);
			$httpBackend.flush();
			var user = followersFactory.getUser();
			expect(user.name).toBe(handle);
			expect(user.followers).toBe(response);
		}));
		it("should populate user's followers details", inject(function(followersFactory, $httpBackend, $stateParams){
			expect(scope.user).toBeUndefined();
			$httpBackend.expectGET(url).respond(response);
			$stateParams.handle = handle;
			var followersController = controller("FollowersController", {$scope: scope, $stateParams: $stateParams});
			$httpBackend.flush();
			expect(scope.user.name).toBe(handle);
			expect(scope.user.followers).toBe(response);
		}));
	});
	describe("show followers", function(){
		var compile;
		beforeEach(inject(function($compile){
			compile = $compile;
		}));
		it("should show followers details", function(){
			scope.user = {
				name: 'twitter',
				followers: ['firefox', 'chrome']
			};
			var template = templateCache.get('followers/followers.tpl.html');
			var element = compile(template)(scope);
			scope.$apply();
			expect(element.html()).toContain(scope.user.name);
			expect(element.html()).toContain(scope.user.followers[0]);
		});
		it("should show option to change twitter handle", function(){
			var template = "<select-handle></select-handle>";
			var html = (compile(template)(scope)).html();
			expect(html).toContain("input");
		});
		it("should change the twitter handle on click of the button", inject(function($state){
			var template = "<select-handle></select-handle>";
			var element = (compile(template)(scope));
			element.scope().handle = "firefox";
			scope.$apply();
			spyOn($state, 'transitionTo');
			element.find("button").triggerHandler("click");
			expect($state.transitionTo).toHaveBeenCalled();
		}));
	});
	
})
;