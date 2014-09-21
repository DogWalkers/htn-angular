angular.module('app')
	.controller('clinicCtrl', ['$scope', '$http', '$window', '$cookieStore', '$location', 'API', function($scope, $http, $window, $cookieStore, $location, API){
		$scope.variable = "abc";
		var token = $cookieStore.get('token');
		$http({
			method: "GET",
			url: "http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic?token="+token.access_token
		}).success(function(data){
			console.log("data is ready");
			console.log(data);
			$scope.patientsInQueue = data.patientsInQueue;
			
		});
	}]);
