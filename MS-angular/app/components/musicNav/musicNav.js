angular.module('myApp').directive('musicNav', function() {
  return {
    	restrict: 'EA',
    	scope : {
          showName : '=showName', //显示姓名还是显示系统名
          username : '=username'   //继承父scope
    	}, 
    	templateUrl: 'components/musicNav/musicNav.html', 
    	transclude: true, 
    	css : 'components/musicNav/musicNav.css'
  };
});