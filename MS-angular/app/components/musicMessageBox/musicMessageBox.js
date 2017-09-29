angular.module('myApp').directive('musicMessageBox', function($rootScope) {
  return {
    	restrict: 'EA',
        replace : true,
    	templateUrl: 'components/musicMessageBox/musicMessageBox.html', 
    	css : 'components/musicMessageBox/musicMessageBox.css', 
		link: function($scope, element, attrs) {
			$rootScope.alert = function(message, callback) { 
				$rootScope.messageBox = {
					type : 'alert', 
					message : message, 
					callback : callback
				}
				$("#messageBox").modal();
				if(!$rootScope.$$phase)
					$rootScope.$apply(); 
			}
			$rootScope.confirm = function(message, callback) {
				$rootScope.messageBox = {
					type : 'confirm', 
					message : message, 
					callback : callback
				}
				$("#messageBox").modal();
				if(!$rootScope.$$phase)
					$rootScope.$apply(); 	
			}
			$scope.callback = function(){
				if($rootScope.messageBox.callback)
					$rootScope.messageBox.callback();
			}
		}
  };
});