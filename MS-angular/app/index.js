var m1 = angular.module("myApp",["ui.router", "LocalStorageModule", "angularCSS"]);
m1.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){

	$stateProvider
		.state("main", {
			url : "/", 
			templateUrl : "views/main.html", 
			controller : "mainController", 
			css : "css/main.css"
		})
		.state("login",{
			url : "/login" ,
			templateUrl : "views/login.html" ,
			controller : "loginController" ,
			css : "css/login.css"
		}).state("home",{
			url : "/home" ,
			templateUrl : "views/home.html" ,
			controller : "homeController",
			css : "css/home.css" 
		}).state("checkFriendRequest",{
			url : "/checkFriendRequest" ,
			templateUrl : "views/checkFriendRequest.html" ,
			controller : "checkFriendRequestController" ,
			css : "css/checkFriendRequest.css"
		}).state("checkShareRequest",{
			url : "/checkShareRequest" ,
			templateUrl : "views/checkShareRequest.html" ,
			controller : "checkShareRequestController" ,
			css : "css/checkShareRequest.css"
		});

 		$urlRouterProvider.when("","/"); 
		$urlRouterProvider.otherwise('/error');
}]);
