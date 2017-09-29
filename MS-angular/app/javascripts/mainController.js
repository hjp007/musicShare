angular.module('myApp').controller("mainController",["$scope","$state","$stateParams", "$http","$timeout", "localStorageService" ,function($scope, $state, $stateParams, $http,$timeout, localStorageService){

	$scope.id = localStorageService.get("identity");

	$scope.toLogin = function () {
		$state.go('login');
	}

	$scope.toHome = function () {
		$state.go('home');
	}

	$scope.toApply = function(){
		$state.go('apply'); 
	}

}]);