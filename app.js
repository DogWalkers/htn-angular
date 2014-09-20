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
            }
            else{
                console.log("sign up as a patient");
            }
        }

    }]);