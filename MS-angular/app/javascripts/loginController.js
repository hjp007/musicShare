angular.module('myApp').controller("loginController",["$scope","$rootScope","$state","$stateParams", "$http","$timeout", "localStorageService" ,function($scope,$rootScope, $state, $stateParams, $http,$timeout, localStorageService){
 
    $scope.id = localStorageService.get("identity");
    if ($scope.id !== null){
        $state.go('home');
    }

    $scope.username = "";
    $scope.password = ""; 
    $scope.toMain = function(){
      $state.go('main');
    }
    $scope.toApply = function(){
        $state.go('apply'); 
    }

    $scope.toHome = function () {
        if ($scope.username==="") {
            $rootScope.alert("账号不能为空");
            return;
        }
        if ($scope.password==="") {
            $rootScope.alert("密码不能为空");
        }
        var postData = {
           "username" : $scope.username,
           "password" : $scope.password
        }
        $http.post('login', postData)
            .success(function (data) {
                if(data.result==='success'){
                    localStorageService.set("identity", data.data);
                    $state.go('home');
                } else {
                    $rootScope.alert(data.message);
                }
            })
            .error(function (error) {

            });
    }
            
       
}]);