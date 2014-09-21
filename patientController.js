var app = angular.module("app");

app.controller('patientCtrl', ['$scope', '$http', '$cookieStore', '$location', function($scope, $http, $cookieStore, $location){
    if ($cookieStore.get("token") == null) {
      $location.path("/");
    }

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

    $scope.patientAddress;
    $scope.clickedGo = false;
    
    $scope.getLatitudeLongitude = function() {
      var geocoder = new google.maps.Geocoder();
        var geocoderRequest = { address: $scope.patientAddress };
        geocoder.geocode(geocoderRequest, function(results, status) {
          console.log(results);
          if(results.length < 1) {
            alert("Could not find address!");
          } else if (results.length > 1) {
            alert("Plsease make your address more specific!");
          } else {
            var latitude = results[0].geometry.location.k;
            var longitude = results[0].geometry.location.B;
            console.log(latitude + "," + longitude);
          }
          $scope.clickedGo = true;
          search(latitude, longitude);
        });
    }

    function initialize(locations) {
        var myOptions = {
            zoom: 7,
            center: new google.maps.LatLng(43.44978,-80.48909),
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
                    createMarker(new google.maps.LatLng(locations[j][1], locations[j][2]), locations[j][0], j, false, true);
                    j--;
                    dropAndCreateMarker(j);
                }, 400);
            }
        }
        dropAndCreateMarker(j);
    }

    var markerArray = []; //create a global array to store markers
    function createMarker(latlng, myTitle, j, home, infoWindowCheck) {
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
            if (infoWindowCheck) {
              var infowindow = new google.maps.InfoWindow({
                  size: new google.maps.Size(150, 50),
                  content: myTitle
              });
              google.maps.event.addListener(marker, 'click', function() {
                  infowindow.open(map, marker);
              });
              setTimeout(function() { infowindow.open(map, marker); }, (j + 3) * 400);
            }
        }

        markerArray.push(marker); //push local var marker into global array
    }
    
    $scope.home = {};
    function search (searchCenterLat, searchCenterLong) {
        var myCircle = new google.maps.Circle({
            center: new google.maps.LatLng(searchCenterLat, searchCenterLong),
            map: map,
            radius: 5000,
            strokeOpacity: 0,
            fillOpacity: 0
        });
        var myBounds = myCircle.getBounds();

        //filters markers
        var curChar = "A";
        for(var i=markerArray.length;i--;) {
          if(!myBounds.contains(markerArray[i].getPosition())) {
              curChar = nextChar(curChar);
              markerArray[i].setMap(null);
              //$scope.clinics[i].clinicName = curChar + ") " + $scope.clinics[i].clinicName;
              var infowindow = new google.maps.InfoWindow({
                size: new google.maps.Size(150, 50),
                content: curChar + ") " + markerArray[i].title
              });
              infowindow.open(map, markerArray[i]);
              createMarker(markerArray[i].position, markerArray[i].title, -3, false, false);
          }
        }
        createMarker(new google.maps.LatLng(searchCenterLat, searchCenterLong), "Home", 0, true, true);
        $scope.home.latitude = searchCenterLat;
        $scope.home.longitude = searchCenterLong;

        map.setCenter(new google.maps.LatLng(searchCenterLat, searchCenterLong));
        map.setZoom(map.getZoom()+5);
    }

    function nextChar(c) {
      return String.fromCharCode(c.charCodeAt(0) + 1);
    }

    // google map API services
    var sendToken = null;
    if ($cookieStore.get("token") != null) {
      sendToken = $cookieStore.get('token').access_token;
    }
    $scope.clinics = null;

    $http({
        method: 'GET',
        url: 'http://hackthenorth-myfirstnodeapp.rhcloud.com/api/clinic/all?token=' + sendToken,
    }).success(function(data, status, headers, config){
        $scope.clinics = data;
        var map = null;
        var locations = new Array();
        for (var i = 0; i < $scope.clinics.length; i++) {
            locations.push([$scope.clinics[i].clinicName, $scope.clinics[i].clinicLatitude, $scope.clinics[i].clinicLongitude, i + 1]);
        }
        initialize(locations);
    });
}]);