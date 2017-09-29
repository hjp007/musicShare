angular.module('myApp').controller("loginController",["$scope","$rootScope","$state","$stateParams", "$http","$timeout", "localStorageService" ,function($scope,$rootScope, $state, $stateParams, $http,$timeout, localStorageService){
 
  $scope.id = localStorageService.get("identity");

  $scope.username = "";
  $scope.password = ""; 
  if ($scope.id !== null){

    $state.go('home');

  }
    $scope.toMain = function(){
      $state.go('main');
    }


    $scope.toHome = function () {
        //表单验证
        var postData = {
           "username" : $scope.username,
           "password" : $scope.password
        }
        var checkForm = 0;
        if ($scope.username==="") {
          $rootScope.alert("账号不能为空")
          checkForm = checkForm + 1;
        }
        else if ($scope.password==="") {
          $rootScope.alert("密码不能为空")
          checkForm = checkForm + 1;
        }
        if (checkForm === 0) {
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
    }
            
       
}]);