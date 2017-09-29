angular.module('myApp').controller("homeController",["$scope","$rootScope","$state","$stateParams", "$http","$timeout","$sce", "localStorageService" ,function($scope,$rootScope, $state, $stateParams, $http,$timeout,$sce, localStorageService){
    $scope.tab = 'SongTab';//SongTab为音乐列表，FriendTab为好友列表 UploadTab为上传页面
	$scope.id = localStorageService.get("identity");
	if ($scope.id == null){
		$state.go('login');
	}

	$scope.user = {}; 
	$http.get('user?id=' + $scope.id)
	    .success(function (data) {
	        if(data.result==='success'){
	            $scope.user = data.data; 
	        } else{
	        	$rootScope.alert(data.message);
	        }
	    })
	    .error(function (error) {
	    });

	$scope.musicUrl = ""; 
	$scope.sce = $sce.trustAsResourceUrl;
	$scope.musicFlag = false; 
    $scope.download = function (url) {
        $http.get('downloadSong?url=' + url)
            .success(function (data) {
                if(data.result==='success'){
                	$scope.musicUrl = data.data;
                	$scope.musicFlag = true; 
                } else{
                    $rootScope.alert(data.message);
                }
            })
            .error(function (error) {
            });
    }
	$scope.toLogin = function () {
		localStorageService.remove('identity');
		$state.go('login'); 
	}
	$scope.toCheckFriendRequest = function () {
		$state.go('checkFriendRequest'); 
	}
	$scope.toCheckShareRequest = function () {
		$state.go('checkShareRequest'); 
	}
}]);