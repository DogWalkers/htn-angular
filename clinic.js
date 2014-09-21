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
			$scope.clinicName = data.clinicName;
			$scope.clinicAddress = data.clinicAddress;
			$scope.patientsInQueue = data.patientsInQueue;
			$scope.patientsInQueue = [{patientId: 1, reasonForVisit: "2014-09-20T23:10:29.380Z", timeEntered: "2014-09-20T23:10:29.380Z"},{patientId: 1, reasonForVisit: "dsgbhjrgej", timeEntered: "shgvhj"},{patientId: 1, reasonForVisit: "dsgbhjrgej", timeEntered: "shgvhj"}]
		});
	}]);
