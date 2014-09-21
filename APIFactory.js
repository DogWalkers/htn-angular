var app = angular.module("app");

app.factory('API', function ($http) {
	var urlBase = "http://hackthenorth-myfirstnodeapp.rhcloud.com";

	var dataFactory = {};

	dataFactory.clinicSignup = function(clinicName, ownerEmail, ownerPassword, clinicAddress, openTime, clinicLatitude, clinicLongitude) {
		return $http({
			method: 'POST',
			url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/signup',
			data: {
				clinicName: clinicName,
				ownerEmail: clinicEmail,
				ownerPassword: clinicPassword,
				clinicAddress: clinicAddress,
				openTime: clinicOpenTime,
				closeTime: clinicCloseTime,
				clinicLatitude: clinicLatitude,
				clinicLongitude: clinicLongitude
			},
			headers: {'Content-Type': 'application/json'}
		});
	}

	dataFactory.clinicLogin = function(email, password){
		return $http({
			method: 'POST',
			url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/login',
			data: {
				ownerEmail: email,
				ownerPassword: password
			},
			headers: {'Content-Type': 'application/json'}
		});
	};

	dataFactory.patientLogin = function(email, password){
		return $http({
			method: 'POST',
			url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/patient/login',
			data: {
				email: email,
				password: password
			},
			headers: {'Content-Type': 'application/json'}
		});
	}

	return dataFactory;
});