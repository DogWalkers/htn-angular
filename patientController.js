var app = angular.module("app");

app.controller('patientCtrl', ['$scope', '$http', '$cookieStore', '$location', function($scope, $http, $cookieStore, $location){
	if(!$cookieStore.get('token')) {
		$location.path('/');
	} 
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
      	var geocoder = new google.maps.Geocoder();
      	var geocoderRequest = { address: patientAddressCompressed };
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
      		}   
      	});
      }
  }]);