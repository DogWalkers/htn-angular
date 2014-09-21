var app = angular.module("app");

app.factory('API', function ($http) {
	var urlBase = "http://hackthenorth-myfirstnodeapp.rhcloud.com";

	var dataFactory = {};

	dataFactory.clinicSignup = function(clinicName, ownerEmail, ownerPassword, clinicAddress, openTime, closeTime, clinicLatitude, clinicLongitude) {
		return $http({
			method: 'POST',
			url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/signup',
			data: {
				clinicName: clinicName,
				ownerEmail: ownerEmail,
				ownerPassword: ownerPassword,
				clinicAddress: clinicAddress,
				openTime: openTime,
				closeTime: closeTime,
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

	dataFactory.patientSignup = function(firstName, lastName, email, password, homeAddress, age, sex, healthCardNumber) {
		return $http({
                    method: 'POST',
                    url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/patient/signup',
                    data: {firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        homeAddress: homeAddress,
                        age: age,
                        sex: sex,
                        healthCardNumber: healthCardNumber
                    },
                        headers: {'Content-Type': 'application/json'}
                    });
	}

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