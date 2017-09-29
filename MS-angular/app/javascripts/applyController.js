angular.module('myApp').controller("applyController",["$scope","$rootScope","$state","$stateParams", "$http","$timeout", "localStorageService" ,function($scope,$rootScope, $state, $stateParams, $http,$timeout, localStorageService){
 
	$scope.id = localStorageService.get("identity");
	$scope.username = "";
	$scope.password = ""; 
	$scope.interest = ""; 
	if ($scope.id !== null){
		$state.go('home');
	}
	$scope.toLogin = function(){
		$state.go('login');
	}
	$scope.toMain = function(){
		$state.go('main');
	}
	$scope.applyAccount = function(){
		if ($scope.username==="") {
            $rootScope.alert("账号不能为空");
            return;
        }
        if ($scope.password==="") {
            $rootScope.alert("密码不能为空");
            return;
        }
        if ($scope.interest==="") {
            $rootScope.alert("兴趣不能为空");
            return;
        }
        var postData = {
           "username" : $scope.username,
           "password" : $scope.password,
           "interest" : $scope.interest
        }
        $rootScope.confirm("确认创建用户" + $scope.username + "吗？", function(){
	        $http.post('apply', postData)
	            .success(function (data) {
	                if(data.result==='success'){
	                	console.log(data.data); 
	                    localStorageService.set("identity", data.data);
	                    $state.go('home');
	                } else {
	                	setTimeout(function(){
		                    $rootScope.alert(data.message);
	                	}, 1000);
	                }
	            })
	            .error(function (error) {
	            });        	
        });
	}
}]);