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

clinicName
ownerEmail
ownerPassword
clinicAddress
openTime
closeTime
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
                var data: {
                        clinicName: "pikachu",
                        ownerEmail: "pikapi@pokemon.com",
                        ownerPassword: "Ash Ketchup",
                        clinicAddress: "Pokeball",
                        openTime: "12:00am",
                        closeTime: "6:00am"
                    };
                $http.post('http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/signup', data).success(function(data, status, headers, config){
                    console.log(data);
                    console.log("success");
                }).error(function(){
                    console.log("error");
                });
            }
            else{
                console.log("sign up as a patient");
            }
        }

    }]);