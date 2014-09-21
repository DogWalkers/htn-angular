angular.module('app')
	.controller('clinicCtrl', ['$scope', '$http', '$window', '$cookieStore', '$location', 'API', function($scope, $http, $window, $cookieStore, $location, API){
		$scope.variable = "abc";
	}]);
