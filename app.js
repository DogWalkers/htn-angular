angular
	.module('app', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './templates/login.html',
                controller: 'loginCtrl'
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

    .controller('loginCtrl', ['$scope', '$http', function($scope, $http){
        $scope.isClinic = false;
        $scope.isPatient = true;
        $scope.showSignIn = false;
        $scope.showSignUp = false;
        $scope.showClinicOrPatient = true;
        console.log("Into login controller");
        $scope.signIn = function(){
            if($scope.isClinic == true){
                console.log("sign in as a clinic");
            }
            else{
                console.log("sign in as a patient");
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
                });
            }
        }

    }]);