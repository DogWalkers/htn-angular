angular
	.module('app', ['ngCookies'])
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
            .when('/clinicLoggedIn',{
                templateUrl: './templates/clinic.html',
                controller: 'clinicController'
            })
            .otherwise({ redirectTo: '/' });
    }])
    //store to cookie
    //Note: you need to change $window.location.href thing.
    .controller('loginCtrl', ['$scope', '$http', '$window', '$cookieStore', function($scope, $http, $window, $cookieStore){
        $scope.isClinic = false;
        $scope.isPatient = true;
        $scope.showSignIn = false;
        $scope.showSignUp = false;
        $scope.showClinicOrPatient = true;
        console.log("Into login controller");
        //signin patients and clinics
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
            //signup clinic
            if($scope.isClinic == true){
                console.log("sign up as a clinic");

            $http({
                method: 'POST',
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+$scope.clinicAddress+'&key=AIzaSyDW6_fagL8iR0nbdKa140dEKmiP4sC6D2k'
            }).success(function(data, status, headers, config){
                console.log(data);
                console.log("success");
                if(data.results.length > 1){
                    alert("Please enter a more precise location.");
                }  
                else if(data.results.length == 0){
                    alert("You have entered an incorrect location.")
                }   
                else{
                    $scope.formatted_address = data.results[0].formatted_address;
                    $scope.clinicLatitude = data.results[0].geometry.location.lat;
                    $scope.clinicLongitude = data.results[0].geometry.location.lng;
                    console.log($scope.clinicLatitude);
                    console.log($scope.clinicLongitude);
                    $http({
                        method: 'POST',
                        url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/signup',
                        data: {clinicName: $scope.clinicName,
                            ownerEmail: $scope.clinicEmail,
                            ownerPassword: $scope.clinicPassword,
                            clinicAddress: $scope.clinicAddress,
                            openTime: $scope.clinicOpenTime,
                            closeTime: $scope.clinicCloseTime,
                            clinicLatitude: $scope.clinicLatitude,
                            clinicLongitude: $scope.clinicLongitude},
                        headers: {'Content-Type': 'application/json'}
                        }).success(function(data, status, headers, config){
                            console.log(data);
                            console.log("success");
                        //$window.location.href = "http://0.0.0.0:8080/#/patientLoggedIn" //You Need to change stuff here
                    });
                }   
            });

            }
            //signup patients
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

            $scope.distBwTwoPoints = function(lat1, lat2, lng1, lng2){ //lat1 and lng1 are source & the other 2 are destination
                //Here I am going to make a POST call to Google API and find the distance between two points.
                //This function will be used to find the distance between the patient and each clinic and only those
                //clinics that are in the radius of 5km are shown.

                $http({
                    method: 'POST',
                    url: 'http://maps.googleapis.com/maps/api/directions/json?origin=Chicago,IL&destination=Los+Angeles,CA&waypoints=Joplin,MO|Oklahoma+City,OK&key=AIzaSyDW6_fagL8iR0nbdKa140dEKmiP4sC6D2k'
                }).success()
            }
            $scope.calltest = function(){
                console.log("calltest");
                $scope.distBwTwoPoints(41.8507300,-87.6512600,41.8525800,-87.6514100);
            }

        $scope.getLatitudeLongitude = function(){
            console.log($scope.patientAddress);
            var patientAddressCompressed = $scope.patientAddress.replace(" ","+");


            $http({
                method: 'POST',
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+patientAddressCompressed+'&key=AIzaSyDW6_fagL8iR0nbdKa140dEKmiP4sC6D2k'
            }).success(function(data, status, headers, config){
                console.log(data);
                console.log("success");
                if(data.results.length > 1){
                    alert("Please enter a more precise location.");
                }  
                else if(data.results.length == 0){
                    alert("You have entered an incorrect location.")
                }   
                else{
                    $scope.formatted_address = data.results[0].formatted_address;
                    $scope.latitude = data.results[0].geometry.location.lat;
                    $scope.longitude = data.results[0].geometry.location.lng;
                    console.log($scope.latitude);
                    console.log($scope.longitude);
                }   
            });
        }

    }]);