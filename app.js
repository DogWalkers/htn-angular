angular
.module('app', ['ngCookies'])
.controller('loginCtrl', ['$scope', '$http', '$window', '$cookieStore', '$location', 'API', function($scope, $http, $window, $cookieStore, $location, API){
    $scope.isClinic = false;
    $scope.isPatient = true;
    $scope.showSignIn = false;
    $scope.showSignUp = false;
    $scope.showClinicOrPatient = true;

    if($cookieStore.get('token')) {
        if ($cookieStore.get('token').patient) {
            $location.path('/patientLoggedIn');
        } else {
            $location.path('/clinicLoggedIn');
        }
    } 
    $scope.signIn = function(){
        if($scope.isClinic == true){
            API.clinicLogin($scope.signInEmail, $scope.signInPassword).success(function(data, status, headers, config){
                $cookieStore.put('token', {access_token: data.token, patient: false});
                location.path('/clinicLoggedIn');
            }).error(function(){
                alert("failed to log in");
            });
        }
        else{
            API.patientLogin($scope.signInEmail, $scope.signInPassword).success(function(data, status, headers, config){
                $cookieStore.put('token', {access_token: data.token, patient: true});
                        $location.path("/patientLoggedIn"); //You Need to change stuff here
                    }).error(function(){
                        alert("failed to log in");
                    });
                }
            }

            $scope.signUp = function(){
                if($scope.isClinic == true){
                    console.log("sign up as a clinic");

                    var geocoder = new google.maps.Geocoder();
                    var geocoderRequest = { address: $scope.clinicAddress };
                    geocoder.geocode(geocoderRequest, function(results, status){
                        console.log(results);
                        if(results.length < 1) {
                            alert("Could not find address!");
                        } else if (results.length > 1) {
                            alert("Please make your address more specific!");
                        } else {
                            var latitude = results[0].geometry.location.k;
                            var longitude = results[0].geometry.location.B;
                            console.log(latitude + "," + longitude);
                            $scope.formatted_address = results[0].formatted_address;
                            $scope.clinicLatitude = latitude;
                            $scope.clinicLongitude = longitude;
                            $http({
                                method: 'POST',
                                url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/signup',
                                data: {
                                    clinicName: $scope.clinicName,
                                    ownerEmail: $scope.clinicEmail,
                                    ownerPassword: $scope.clinicPassword,
                                    clinicAddress: $scope.clinicAddress,
                                    openTime: $scope.clinicOpenTime,
                                    closeTime: $scope.clinicCloseTime,
                                    clinicLatitude: $scope.clinicLatitude,
                                    clinicLongitude: $scope.clinicLongitude
                                },
                                headers: {'Content-Type': 'application/json'}
                            }).success(function(data, status, headers, config){
                                console.log(data);
                                console.log("success");
                                $cookieStore.put('token', {access_token: data.token, patient: false});
                                location.path('/clinicLoggedIn');
                            });
                        }   
                    });

                } else{
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
                        $cookieStore.put('token', {access_token: data.token, patient: true});
                        $location.path("/patientLoggedIn"); //You Need to change stuff here
                    }).error(function(){
                        alert("failed to sign up");
                    });
                }
            }
        }])

.controller('patientCtrl', ['$scope', '$http', function($scope, $http){
    console.log("In patient controller");

            $scope.distBwTwoPoints = function(lat1, lat2, lng1, lng2){ //lat1 and lng1 are source & the other 2 are destination
                console.log("in distBwTwoPoints");
                var map;
                var geocoder;
                var bounds = new google.maps.LatLngBounds();
                //var markersArray = [];
                var origin = new google.maps.LatLng(lat1, lng1);
                var destination = new google.maps.LatLng(lat2, lng2);

                
                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(
                {
                  origins: [origin],
                  destinations: [destination],
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC,
                  avoidHighways: false,
                  avoidTolls: false
              }, callback);
                

                function callback(response, status) {
                  if (status != google.maps.DistanceMatrixStatus.OK) {
                    alert('Error was: ' + status);
                } else {
                    var origins = response.originAddresses;
                    var destinations = response.destinationAddresses;

                    for (var i = 0; i < origins.length; i++) {
                      //var results = response.rows[i].elements;
                      console.log(response.rows[0].elements[0].distance.value);
                      var distanceInMeters = response.rows[0].elements[0].distance.value;
                      //addMarker(origins[i], false);
                      // for (var j = 0; j < results.length; j++) {
                      //   //addMarker(destinations[j], true);
                      //   outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
                      //       + ': ' + results[j].distance.text + ' in '
                      //       + results[j].duration.text + '<br>';
                      // }
                  }
              }
              return distanceInMeters;
          }
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