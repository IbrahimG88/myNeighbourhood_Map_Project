var Model = ko.observableArray([
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
]);





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
};



//=========ViewModel========

var AppViewModel = function () {


    for (var i = 0; i < Model().length; i++) {
        var position = Model()[i].location;
        console.log(position);
        var title = Model()[i].title;
        console.log(title);
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map,
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);


            marker.addListener("click", function () {
                InfoWindowContent(this, infowindow);
            });



    }

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


    // Deletes all markers in the array by removing references to them.
    document.getElementById("selectedMarker").addEventListener('click', function () {


        function deleteMarkers() {

            clearMarkers();
            markers = [];

            var position = mypar.location;
            //console.log(position);
            //console.log(position);
            var title = mypar.title;
            //console.log(title);
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                map: map,
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);

            marker.addListener("click", function () {
                InfoWindowContent(this, infowindow);
            });

            return markers;

        }
        deleteMarkers();
    });



    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }






    //markers in global scope, to null it to display the filtered search





    //end of markers....











    self.chosenPlace = ko.observable("");
    self.filter = ko.computed(function () {
        return self.chosenPlace().toUpperCase();
    });


    self.completeFilter = ko.computed(function () {
        var a;
        var b;

    
        for (var i = 0; i < Model().length; i++) {
            //now add an if statement with or for title and type
            // if(a == Model()[i].title || a == Model()[i].type){}
            a = Model()[i].title;
            b = Model()[i].type;
            //console.log(a);
            //console.log(b);
            //This method returns -1 if the value to search for never occurs.
            if (a.toUpperCase().indexOf(self.filter()) > -1) {

                mypar = Model()[i];
                //  listItems[i].style.display = "";

            }
            else if (b.toUpperCase().indexOf(self.filter()) > -1) {

                mypar = Model()[i];
                console.log(mypar);
                //will keep the display previous value which is block
                //     listItems[i].style.display = "";
                // }
                //   else if (a.indexOf(self.filter()) <= -1 && b.indexOf(self.filter()) <= -1){
                //     listItems[i].style.display = "none";
            }
        }

        return mypar;
    });




    var infowindow = new google.maps.InfoWindow();
    var locationInfo;
    var locationUrl;
    var InfoWindowContent = function (marker, infoWindowPar) {
        console.log("yy");



            var wikipediaUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback";
            var wikiTimeout = setTimeout(function () {
                alert("failed to load wikipedia page");
            }, 5000);

            $.ajax({

                url: wikipediaUrl,
                dataType: "jsonp",
            }).done(function (response) {
                clearTimeout(wikiTimeout);
                locationInfo = response[2][0];
                locationUrl = response[3][0];
                console.log(response);
                console.log(locationInfo);
                console.log(locationUrl);
                infoWindowPar.setContent('<div>' + marker.title + '<br>' + locationInfo + '<a href="' + locationUrl + '"> Location Wikipedia URL: ' + locationUrl + '</a></div>');

            });

        

        infoWindowPar.marker = marker;
        infowindow.open(map, marker);

    };

    self.FilteringToInput = ko.computed(function () {

        var ul = document.getElementById("LiOptions");
        var listItems = ul.getElementsByTagName('li');
        var c;
        for (var i = 0; i < listItems.length; i++) {
      
            c = listItems[i];
               
            if (c.innerHTML.toUpperCase().indexOf(self.filter()) > -1) {
                 console.log('yy');
                listItems[i].style.display = "";
            }
            else {
                listItems[i].style.display = "none";
            }
        }
    });



};