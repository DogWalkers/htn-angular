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
			//$scope.patientsInQueue = [{patientName: "1vjhkrugh", reasonForVisit: "gjkehgje", timeEntered: "2014-09-20T23:10:29.380Z"},{patientName: "fehwgjerhg", reasonForVisit: "dsgbhjrgej", timeEntered: "2014-09-20T23:10:29.380Z"}]
			
			for(var i = 0; i < $scope.patientsInQueue.length; i++){
				var date = new Date($scope.patientsInQueue[i].timeEntered);
				var timenow = new Date();
				var milliseconds = -(date.getTime() - timenow.getTime());

				$scope.patientsInQueue[i].seconds = Math.floor(Math.floor(milliseconds/1000)%60);
				$scope.patientsInQueue[i].minutes = Math.floor(Math.floor(milliseconds/1000)/60);
				$scope.patientsInQueue[i].hours = 0;
				if($scope.patientsInQueue[i].minutes >= 60){
					$scope.patientsInQueue[i].hours = Math.floor($scope.patientsInQueue[i].minutes/60);
					$scope.patientsInQueue[i].minutes = Math.floor($scope.patientsInQueue[i].minutes%60);
				}
			}

			$scope.patientRemove = function(i){
				console.log("patientRemove");
				console.log(i);
				console.log("http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/queue/"+String($scope.patientsInQueue[i].patientId)+"?token="+token.access_token);
				$http({
					method: "GET",
					url: "http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/queue/"+String($scope.patientsInQueue[i].patientId)+"?token="+token.access_token
				}).success(function(data){
					console.log(data);
				});
			}
		});
	}]);
