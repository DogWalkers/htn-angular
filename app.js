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

            API.patientLogin($scope.signInEmail, $scope.signInPassword).success(function(data){
                $cookieStore.put('token', {access_token: data.token, patient: true});
                        $location.path("/patientLoggedIn");
                    }).error(function(){
                        alert("failed to log in");
                    });
                }
            }

            $scope.signUp = function(){
                if($scope.isClinic == true){
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
                            API.clinicSignup(
                                $scope.clinicName,
                                $scope.clinicEmail,
                                $scope.clinicPassword,
                                $scope.clinicAddress,
                                $scope.clinicOpenTime,
                                $scope.clinicCloseTime,
                                $scope.clinicLatitude,
                                $scope.clinicLongitude
                                )
                            .success(function(data){
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
    // scope variables and functions
    $scope.distBwTwoPoints = function(lat1, lat2, lng1, lng2) { //lat1 and lng1 are source & the other 2 are destination
        console.log("in distBwTwoPoints");
        var map;
        var geocoder;
        var bounds = new google.maps.LatLngBounds();
        //var markersArray = [];
        var origin = new google.maps.LatLng(lat1, lng1);
        var destination = new google.maps.LatLng(lat2, lng2);

        
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
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
                    console.log(response.rows[0].elements[0].distance.value);
                    var distanceInMeters = response.rows[0].elements[0].distance.value;
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

                $scope.search(new google.maps.LatLng($scope.latitude, $scope.longitude));
            }
        });
    }



    // google map API services
    var sendToken = $cookieStore.get('token').access_token;
    $scope.clinics = null;

    $http({
        method: 'GET',
        url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/all?token=' + sendToken,
    }).success(function(data, status, headers, config){
        $scope.clinics = data;
    });

    var map = null;
    var markerArray = []; //create a global array to store markers
    var locations;
    for (var i = 0; i < $scope.clinics.length; i++) {
        locations.push({$scope.clinics[i].clinicName, $scope.clinics[i].clinicLatitude, $scope.clinics[i].clinicLongitude, i + 1});
    }
    
    /*var locations = [
    ['Bondi Beach', -33.890542, 151.274856, 4],
    ['Coogee Beach', -33.923036, 151.259052, 5],
    ['Cronulla Beach', -34.028249, 151.157507, 3],
    ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
    ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];*/

    function initialize() {
        var myOptions = {
            zoom: 10,
            center: new google.maps.LatLng(46.0730555556, -100.546666667),
            mapTypeControl: false,
            navigationControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        var j = locations.length - 1;

        function dropAndCreateMarker(j) {
            if (j == -1) {
                return;
            } else {
                setTimeout(function() {
                    createMarker(new google.maps.LatLng(locations[j][1], locations[j][2]), locations[j][0], j);
                    j--;
                    dropAndCreateMarker(j);
                }, 400);
            }
        }
        dropAndCreateMarker(j);
    }

    function createMarker(latlng, myTitle, j, home) {
        var tempFilePath = null;
        if (!home) {
            tempFilePath = '../assets/img/locationMarker.png';
        } else {
            tempFilePath = '../assets/img/homeMarker.png';
        }
        var marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: latlng,
            map: map,
            zIndex: Math.round(latlng.lat() * -100000) << 5,
            icon: tempFilePath,
            title: myTitle
        });

        if (!home) {
            // create infowindow with a size and content, then add a listener to it and then open it
            var infowindow = new google.maps.InfoWindow({
                size: new google.maps.Size(150, 50),
                content: myTitle
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
            setTimeout(function() { infowindow.open(map, marker); }, (j + 3) * 400);
        }

        markerArray.push(marker); //push local var marker into global array
    }
    
    window.onload = initialize;

    function search = function(searchCenter) {
        var myCircle = new google.maps.Circle({
            center: searchCenter,
            map: map,
            radius: 5000,
            strokeOpacity: 0,
            fillOpacity: 0
        });
        var myBounds = myCircle.getBounds();

        //filters markers
        for(var i=markerArray.length;i--;) {
            if(!myBounds.contains(markerArray[i].getPosition()))
                markerArray[i].setMap(null);
        }
        map.setCenter(searchCenter);
        map.setZoom(map.getZoom()+1);
    }
}]);