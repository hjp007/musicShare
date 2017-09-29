angular.module('myApp').controller("checkShareRequestController",["$scope","$rootScope","$state","$stateParams", "$http","$timeout", "localStorageService" ,function($scope,$rootScope, $state, $stateParams, $http,$timeout, localStorageService){

	$scope.message = ""; 

	$scope.id = localStorageService.get("identity");
	if ($scope.id == null){
		$state.go('login');
	}


	//俩个接口合体
	$scope.user = {}; 
	$scope.shareRequests = []; 
	$http.get('checkshareRequest?id=' + $scope.id)
	    .success(function (data) {
	        if(data.result==='success'){
	        	$scope.user = data.data.user;
	            $scope.shareRequests = data.data.shareRequests; 
	        } else{

	        	$rootScope.alert(data.message);
	        }
	    })
	    .error(function (error) {

	    });


	$scope.shareOperationStatus = 0;
	$scope.friendName = ""; 
	$scope.selectFriend = function (friend) {
		$scope.shareOperationStatus = 1; 
		$scope.friendName = friend.name; 
	}
	$scope.selectSong = function (song){
		$scope.shareOperationStatus = 0;
		if($scope.friendName == ""){
			$rootScope.alert("未知错误！"); 
			return; 
		}
		var postData = {
			id : $scope.id, 
			friendName : $scope.friendName, 
			songId : song._id
		}
		$http.post('addShare', postData)
		    .success(function (data) {
		        if(data.result==='success'){
		        	$rootScope.alert("分享已经发送！", function(){
		            	window.location.reload();
		        	}); 
		        } else{
		        	$rootScope.alert(data.message);
		        }
		    })
		    .error(function (error) {

		    });
	}

	$scope.resetStatus = function(){
		$scope.shareOperationStatus = 0;
	}

    $scope.replyShareRequest = function(requestId, status) {
    	var postData = {
           "requestId" : requestId,
           "status" : status
        }  
        $http.post('replyShareRequest', postData)
            .success(function (data) {
		        if(data.result==='success'){
		            $rootScope.alert("您的回复已经发送！歌曲会出现在您列表里！", function(){
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