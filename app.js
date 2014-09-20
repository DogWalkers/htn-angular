angular
	.module('app', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './templates/main.html',
                controller: 'appCtrl'
                })
            .otherwise({ redirectTo: '/' });
    }])
    .controller('appCtrl', ['$scope', '$http', function($scope, $http){ 
    	console.log("in appCtrl");
        $scope.var = "abc";
    }]);