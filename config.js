var app = angular.module('app');

app.config(['$routeProvider', function($routeProvider) {
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
}]);