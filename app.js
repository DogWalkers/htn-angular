angular
	.module('app', [])
    .controller('appCtrl', ['$scope', '$http', function($scope, $http){ 
    	console.log("in appCtrl");
        $scope.var = "abc";
    }]);