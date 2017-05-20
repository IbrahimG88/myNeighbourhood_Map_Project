"use strict";

var Model = [
    {
        title: "Santiago Bernabéu Stadium",
        location: { lat: 40.453291 , lng: -3.688302 },
        type: "Football Stadium"
    },
    {
        title: "Zoo Aquarium de Madrid",
        location: { lat: 40.409183 , lng: -3.761418 },
        type: "Zoo and Aquarium"
    },
    {
        title: "Royal Palace of Madrid",
        location: { lat: 40.418184, lng: -3.714258 },
        type: "Royal Historic Monument"

    },
    {
        title: "Plaza Mayor, Madrid",
        location: { lat: 40.415642, lng: -3.707401 },
        type: "Historic Monument"
    },
    {
        title: "Museo Nacional Centro de Arte Reina Sofía",
        location: { lat: 40.407937, lng: -3.694535 },
        type: "Spain's national museum of 20th-century art"
    }
];
//global variables:::
var map;
var markers = [];
var mypar;
var self = this;
//=======initmap function====in the google api callback
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.418092, lng: -3.703569 },
        zoom: 13
    });
    ko.applyBindings(new AppViewModel());
}
//===googleMaps onerror()====
function errorMessage() {
    alert('An error hindered google Maps from loading your request');
}
//=========ViewModel========
var AppViewModel = function () {

    map.addListener('center_changed', function () {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(function () {
            map.panTo(marker.getPosition());
        }, 5000);
    });
    markers.forEach(function (item) {
        item.addListener('click', function () {
            map.setZoom(10);
            map.setCenter(marker.getPosition());
        });
    });
    for (var i = 0; i < Model.length; i++) {
        var position = Model[i].location;
        console.log(position);
        var title = Model[i].title;
        console.log(title);
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map,
            icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                strokeColor: '#660000',
                strokeOpacity: 0.5,
                strokeWeight: 4
            },

            id: i
        });
        markers.push(marker);
        marker.addListener("click", function () {
            infoWindowContent(this, infoWindow);
            toggleBounce(this);
        });
        var AddMarkerToModel = function () {
            Model[i].marker = marker;
        };
        new AddMarkerToModel();
    }
    function toggleBounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
   marker.setAnimation(null);
}, 4000);
    }
    var LocationsRewrite = function (data) {
        this.title = data.title;
        this.location = data.location;
        this.marker = data.marker;
        this.type = data.type;
    };
    //LocationsArray
    self.LocationsArray = ko.observableArray([]);
    Model.forEach(function (location) {
        self.LocationsArray.push(new LocationsRewrite(location));
    });
    //important::.id property gives indexes for every array item numbering
    //now every  self.LocationsArray() item has an id number
    self.LocationsArray().forEach(function (eachArrayItem, index) {
        eachArrayItem.marker.id = index;
    });
    //Markers all functions:
    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }
    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }
    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }
    var infoWindow = new google.maps.InfoWindow();
    var locationInfo;
    var locationUrl;
    var infoWindowContent = function (marker, infoWindowPar) {
        console.log("yy");
           
        var wikipediaUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback";

        $.ajax({
            url: wikipediaUrl,
            dataType: "jsonp",
        }).done(function (response) {
                 infoWindowPar.setContent('');
            locationInfo = response[2][0];
            locationUrl = response[3][0];
            console.log(response);
            console.log(locationInfo);
            console.log(locationUrl);
       
            infoWindowPar.setContent('<div>' + marker.title + '<br>' + locationInfo + '<a href="' + locationUrl + '"> Location Wikipedia URL: ' + locationUrl + '</a></div>');
        }).fail(function (jqXHR, textStatus) {
            alert("Ajax request failed to fetch Wikipedia info");
        });
        infoWindowPar.marker = marker;
        infoWindow.open(map, marker);
    };
    function showMarkersAll() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible();
        }
    }
    self.filter = ko.observable("");
    self.filteredItems = ko.computed(function () {
        //local filter variable:
        var filter = this.filter().toLowerCase();
        if (!filter) {
            console.log("hellos");
            showMarkersAll();
            return self.LocationsArray();
        }
        else {
            return ko.utils.arrayFilter(Model, function (item) {
                var visibleplaces = item.title.toLowerCase().indexOf(filter) !== -1;
                item.marker.setVisible(visibleplaces);
                return visibleplaces;

            });
        }
    }, self);
    self.liClicked = function (currentItem) {
     //   markers.forEach(function (item) {
       //     item.setVisible(false);
       // });
        console.log(currentItem);
        var myLoc = currentItem;
        var Solve = myLoc.marker;
        Solve.setVisible();
      infoWindowContent(Solve, infoWindow);
        toggleBounce(Solve);
    };
};
