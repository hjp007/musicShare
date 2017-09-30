angular.module('myApp').directive('musicUploader',['$http','$rootScope','localStorageService', function($http, $rootScope, localStorageService){
  return {
    	restrict: 'EA',
    	scope : {
    	}, 
      link: function($scope, element, attrs) {
        $scope.percentage = 0; 
        $scope.id = localStorageService.get("identity");
        $scope.accepts = {
          checkType : ['audio/mp3','audio/wav','audio/wma','audio/ogg','audio/mpeg', 'audio/x-ms-wma'], //手机会被转成mpeg,x-ms-wma格式
          maxSize : 11000000
        }
        $scope.contains = function(arr, obj) {
          var i = arr.length;
          while (i--) {
              if (arr[i] === obj) {
                  return true;
              }
          }
          return false;
        }
        $scope.upload = function (event){
          var file = event.target.files[0]; 
          console.log(file);
          if (file) {
              if(file.size > $scope.accepts.maxSize){
                  $rootScope.alert("文件超过10M！");
                  return; 
              }
              if(!$scope.contains($scope.accepts.checkType, file.type)){
                  $rootScope.alert('请上传音乐！目前支持mp3,wav,wma,ogg格式！');
                  return; 
              }
              var formData = new FormData();
              formData.append('file', file);
              var postData = {
                  filename : file.name, 
                  id : $scope.id
              };
              $http.post('token', postData)
                  .success(function (data) {
                      if(data.result==='success'){
                          formData.append('token', data.data.token);
                          formData.append('key', data.data.key);
                          $http({
                              method:'POST',
                              url:"https://up.qbox.me/",
                              data: formData,
                              headers: {'Content-Type':undefined},
                              uploadEventHandlers: {
                                  progress: function(e) {
                                      $scope.percentage = Math.round(e.loaded*100/e.total);
				      if($scope.$$phase){
				      	$scope.$apply();
  			   	      }
                                 } 
                              }
                          })
                          .success(function(data) {
                              if(data.hash && data.key){
                                  console.log("七牛云上传成功！");
                                  var postData = {
                                      userID : $scope.id, 
                                      name : file.name, 
                                      url : 'http://oqyw1ztb2.bkt.clouddn.com/' + data.key
                                  };
                                  $http.post('createSong', postData)
                                      .success(function (data) {
                                          if(data.result==='success'){
                                              $rootScope.alert("操作成功！", function(){
                                                window.location.reload(); 
                                              });
                                          } else{
                                              $rootScope.alert(data.message);
                                          }
                                      })
                                      .error(function (error) {

                                      });
                              }

                          })
                          .error(function (error) {
                          });
                      } else{
                          $rootScope.alert(data.message);
                      }
                  })
                  .error(function (error) {

                  });
                      
          }
        }
      },
    	templateUrl: 'components/musicUploader/musicUploader.html', 
    	css : 'components/musicUploader/musicUploader.css'
  };
}]);
