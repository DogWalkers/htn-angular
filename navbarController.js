var app = angular.module("app");

app.controller("NavbarController", ['$scope', '$cookieStore', '$location', function ($scope, $cookieStore, $location) {
	$scope.name = "Hello";
	$scope.logout = function() {
		$cookieStore.remove("token");
		$location.path("/");
	}
}]);