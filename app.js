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
        $scope.showSignIn = false;
        $scope.showSignUp = false;
        $scope.showClinicOrPatient = true;
        
        $scope.signInPatient = function(){
            console.log("sign in patient");
        }

        $scope.signInClinic = function(){
            console.log("signInClinic");
        }

        $scope.signUpPatient = function(){
            console.log("signUpPatient");
        }

        $scope.signUpClinic = function(){
            console.log("signUpClinic");
        }

    }]);