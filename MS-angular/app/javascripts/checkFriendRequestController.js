angular.module('myApp').controller("checkFriendRequestController",["$scope","$rootScope","$state","$stateParams", "$http","$timeout", "localStorageService" ,function($scope, $rootScope, $state, $stateParams, $http,$timeout, localStorageService){
	
    $scope.tab = 'CheckTab';//CheckTab为信息列表，AddTab为加友页面


	$scope.id = localStorageService.get("identity");
	if ($scope.id == null){
		$state.go('login');
	}


	//俩个接口合体
	$scope.user = {}; 
	$scope.friendRequests = []; 
	$http.get('checkFriendRequest?id=' + $scope.id)
	    .success(function (data) {
	        if(data.result==='success'){
	        	$scope.user = data.data.user;
	            $scope.friendRequests = data.data.friendRequests; 

	        } else{
	        	$rootScope.alert(data.message);
	        }
	    })
	    .error(function (error) {
	    });


    $scope.searchFriend= function (){ 
    	if($scope.searchuser===""){
    		$rootScope.alert("请填写名称！");
    		return;
    	}
    	if($scope.searchuser===$scope.user.name){
    	    $rootScope.alert("请不要写自己的名字！");
    		return;	
    	}
        $http.get('searchFriend?username='+$scope.searchuser)
            .success(function (data) {
		        if(data.result==='success'){
		            $scope.result = data.data;
	                $scope.emshow = {
						show: true                 
	                }
		        } else{
		        	$rootScope.alert(data.message);
		        	$scope.emshow = {
						show: false                 
	                }
		        }  	

            })
            .error(function (error) {
            })
    };

    $scope.friendRequest = function (){ 
        var postData = {
           "id" : $scope.id,
           "friendName" : $scope.result.name
        }  
        $http.post('addFriend', postData)
            .success(function (data) {
		        if(data.result==='success'){
		            $rootScope.alert("您的请求已经发送，等待对方确认！", function(){
		            	window.location.reload();
		            }); 
		        } else{
		        	$rootScope.alert(data.message);
		        }
            })
            .error(function (error) {

            })
    };

    $scope.replyFriendRequest = function(requestId, status) {
    	var postData = {
           "requestId" : requestId,
           "status" : status
        }  
        $http.post('replyFriendRequest', postData)
            .success(function (data) {
		        if(data.result==='success'){
		            $rootScope.alert("您的回复已经发送！", function(){
		            	window.location.reload();
		            }); 
		        } else{
		        	$rootScope.alert(data.message);
		        }
            })
            .error(function (error) {

            })
    }
            



	$scope.toHome = function () {
		$state.go('home'); 
	}

	$scope.toLogin = function () {
		localStorageService.remove('identity');
		$state.go('login'); 
	}


}]);