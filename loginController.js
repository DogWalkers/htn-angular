var app = angular.module("app");
app.controller('loginCtrl', ['$scope', '$http', '$window', '$cookieStore', '$location', 'API', function($scope, $http, $window, $cookieStore, $location, API){
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
            console.log("signIn is Clinic");
            API.clinicLogin($scope.signInEmail, $scope.signInPassword).success(function(data, status, headers, config){
                console.log("success");
                $cookieStore.put('token', {access_token: data.token, patient: false});
                $location.path('/clinicLoggedIn');
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

        } else {
            API.patientSignup($scope.patientFirstName,
            $scope.patientLastName,
            $scope.patientEmail,
            $scope.patientPassword,
            $scope.patientAddress,
            $scope.patientAge,
            $scope.patientGender,
            $scope.patientHealthCard)
                .success(function(data, status, headers, config){
                    $cookieStore.put('token', {access_token: data.token, patient: true});
                    $location.path("/patientLoggedIn");
                });
        }
    }
}]);