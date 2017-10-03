angular.module('myApp').controller("homeController",["$scope","$rootScope","$state","$stateParams", "$http","$timeout","$sce", "localStorageService" ,function($scope,$rootScope, $state, $stateParams, $http,$timeout,$sce, localStorageService){
    $scope.tab = 'SongTab';//SongTab为音乐列表，FriendTab为好友列表 UploadTab为上传页面 SearchTab为歌曲搜索页面
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

	$scope.timer = null;
    $scope.resultSongs = [];   //成功时的数据
    $scope.resultMessage = "";  //失败时的信息
    $scope.searchingStatus = "before";   //4个状态 before search over 
    $scope.dynamicSearch = function(){
    	if($scope.searchSong===""){
        	$scope.resultSongs = [];
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
			$http.get('searchSongs?songname=' + $scope.searchSong)
	            .success(function (data) {
    				$scope.searchingStatus = "over";
			        if(data.result==='success'){
		                $scope.resultSongs = data.data;
			        } else{
			        	$scope.resultSongs = [];
			        	$scope.resultMessage = data.message;
			        }  	
	            })
		},500);
    }
    $scope.addSong = function(song){
    	var postData = {
    		songId : song._id, 
    		id : $scope.id
    	}
        $http.post('addSongToMyList', postData)
            .success(function (data) {
                if(data.result==='success'){
                	$rootScope.alert("歌曲添加成功！", function(){
		            	window.location.reload();
                	});
                } else{
                    $rootScope.alert(data.message);
                }
            })
            .error(function (error) {
            });	
    }
}]);