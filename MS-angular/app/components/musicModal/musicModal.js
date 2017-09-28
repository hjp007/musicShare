angular.module('myApp').directive('musicModal', function() {
  return {
    	restrict: 'EA',
        replace : true,
    	scope : {
    	}, 
    	templateUrl: 'components/musicModal/musicModal.html', 
    	transclude: {
            title: 'modalTitle',
            body: 'modalBody',
            footer: '?modalFooter'
        }, 
    	css : 'components/musicModal/musicModal.css'
  };
});