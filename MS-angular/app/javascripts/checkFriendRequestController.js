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
	    
    $scope.timer = null;
    $scope.resultUsers = [];   //成功时的数据
    $scope.resultMessage = "";  //失败时的信息
    $scope.searchingStatus = "before";   //4个状态 before search over 
    $scope.dynamicSearch = function(){
    	if($scope.searchuser===""){
        	$scope.resultUsers = [];
        	$scope.resultMessage = "请填写名称！";
        	$timeout.cancel($scope.timer);
        	return;
    	}
		$timeout.cancel($scope.timer);
		$scope.timer = $timeout(function(){
			//正在搜索字样也不要立刻就展示,如果300毫秒内拿到结果了就不展示了
			$scope.searchingStatus = "before";   
    		setTimeout(function(){
    			if($scope.searchingStatus != "over")
    				$scope.searchingStatus = "search";
    		}, 300);   
    		//500毫秒后查找
			$http.get('searchFriends?username=' + $scope.searchuser + '&myname=' + $scope.user.name)
	            .success(function (data) {
    				$scope.searchingStatus = "over";
			        if(data.result==='success'){
		                $scope.resultUsers = data.data;
			        } else{
			        	$scope.resultUsers = [];
			        	$scope.resultMessage = data.message;
			        }  	
	            })
		},500);
    }
    $scope.friendRequest = function (user){ 
        var postData = {
           "id" : $scope.id,
           "friendName" : user.name
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