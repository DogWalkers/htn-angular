angular
	.module('app', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './templates/login.html',
                controller: 'loginCtrl'
                })
            .when('/patientLoggedIn',{
                templateUrl: './templates/patient.html',
                controller: 'patientCtrl'
            })
            // .when('/login', {   //   /#/login
            //     templateUrl: './templates/login.html',
            //     controller: 'loginCtrl'
            // })
            .otherwise({ redirectTo: '/' });
    }])
    .config(function($httpProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
    .controller('appCtrl', ['$scope', '$http', function($scope, $http){ 
    	console.log("in appCtrl");
    }])
    //store to cookie
    //Note: you need to change $window.location.href thing.
    .controller('loginCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
        $scope.isClinic = false;
        $scope.isPatient = true;
        $scope.showSignIn = false;
        $scope.showSignUp = false;
        $scope.showClinicOrPatient = true;
        console.log("Into login controller");
        $scope.signIn = function(){
            if($scope.isClinic == true){
                $http({
                    method: 'POST',
                    url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/login',
                    data: {
                        ownerEmail: $scope.signInEmail,
                        ownerPassword: $scope.signInPassword},
                    headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config){
                        console.log(data);
                        console.log("success");
                        //$window.location.href = "http://0.0.0.0:8080/#/patientLoggedIn"  //You Need to change stuff here
                });
            }
            else{
                $http({
                    method: 'POST',
                    url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/patient/login',
                    data: {
                        email: $scope.signInEmail,
                        password: $scope.signInPassword},
                    headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config){
                        console.log(data);
                        console.log("success");
                        $window.location.href = "http://0.0.0.0:8080/#/patientLoggedIn" //You Need to change stuff here
                });
            }
        }

        $scope.signUp = function(){
            if($scope.isClinic == true){
                console.log("sign up as a clinic");
                
                $http({
                    method: 'POST',
                    url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/signup',
                    data: {clinicName: $scope.clinicName,
                        ownerEmail: $scope.clinicEmail,
                        ownerPassword: $scope.clinicPassword,
                        clinicAddress: $scope.clinicAddress,
                        openTime: $scope.clinicOpenTime,
                        closeTime: $scope.clinicCloseTime},
                    headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config){
                        console.log(data);
                        console.log("success");
                        //$window.location.href = "http://0.0.0.0:8080/#/patientLoggedIn" //You Need to change stuff here
                });

            }
            else{
                $http({
                    method: 'POST',
                    url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/patient/signup',
                    data: {firstName: $scope.patientFirstName,
                        lastName: $scope.patientLastName,
                        email: $scope.patientEmail,
                        password: $scope.patientPassword,
                        homeAddress: $scope.patientAddress,
                        age: $scope.patientAge,
                        sex: $scope.patientGender,
                        healthCardNumber: $scope.patientHealthCard},
                    headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config){
                        console.log(data);
                        console.log("success");
                        $window.location.href = "http://0.0.0.0:8080/#/patientLoggedIn" //You Need to change stuff here
                });
            }
        }


    }])

    .controller('patientCtrl', ['$scope', '$http', function($scope, $http){
        console.log("In patient controller");
        $scope.getLatitudeLongitude = function(){
            console.log($scope.patientAddress);
            var patientAddressCompressed = $scope.patientAddress.replace(" ","+");
            $http({
                method: 'POST',
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+patientAddressCompressed+'&key=AIzaSyDW6_fagL8iR0nbdKa140dEKmiP4sC6D2k'
            }).success(function(data, status, headers, config){
                        console.log(data);
                        console.log("success");
                        
            });
        }

    }]);