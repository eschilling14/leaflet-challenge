// function
    function createMap(earthquakes) {

        // Create the tile layer that will be the background of our map
        var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
        });
        
        // Create a baseMaps object to hold the lightmap layer
        var baseMaps = {
            "Light Map": lightmap
        };
    
        // Create an overlayMaps object
        var overlayMaps = {
            "Earthquakes":earthquakes
        };
    
        // Create the map object with options
        var map = L.map("map", {
            center: [38.6270, -90.1994],
            zoom: 5,
            layers: [lightmap, earthquakes]
        });
    
        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: true
        }).addTo(map);
    
        // Create a legend to display information about our map
        var info = L.control({
            position: 'bottomright'
        });

        // When the layer control is added, insert a div with the class of "legend"
        info.onAdd = function () {
            var div = L.DomUtil.create("div", "legend");
            // console.log(map);
            return div;
        };
    
        
        // Add the info legend to the map
        info.addTo(map);
    
        document.querySelector(".legend").innerHTML = [
            "<p class='title'>Earthquake Intensity </p>",
            "<p class='dash'>-------------------- </p>",
            "<p class='six'>Magnitude 6.0+ </p>",
            "<p class='five'>Magnitude 5.0 - 5.9 </p>",
            "<p class='four'>Magnitude 4.0 - 4.9 </p>",
            "<p class='three'>Magnitude 3.0 - 3.9 </p>",
            "<p class='two'>Magnitude 2.0 - 2.9 </p>",
            "<p class='undertwo'>Less than Magnitude 2.0 </p>"
        ].join("");
    
    
    }
    
    
    function createMarkers(circles) {

        var features = circles.features;
    
        // Initialize an array to hold quake markers
        var markers = [];
    
        // Loop through the features array
        for (var index = 0; index < features.length; index++) {
            var feature = features[index];
            // console.log(feature);       // works
    
            
            function chooseColor(feature) {
                var mag = feature.properties.mag;
                if (mag >= 6.0) {
                    return "darkred";
                }
                else if (mag >= 5.0) {
                    return "red";
                }
                else if (mag >= 4.0) {
                    return "orange";
                }
                else if (mag >= 3.0) {
                    return "yellow";
                }
                else if (mag >= 2.0) {
                    return "green";
                }
                else {
                    return "lightgreen";
                }
            };
    

            var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { color: chooseColor(feature) })

                .bindPopup("<h3>Location: " + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "<h3>Felt: " +
                    feature.properties.felt + "<h3>Coordinates: " + feature.geometry.coordinates[1] + ", " + feature.geometry.coordinates[0] +
                    "<br><a href='" + feature.properties.url + "'>More info</a>")

                .setRadius(Math.round(feature.properties.mag) * 10)

            // Add the marker to the markers array
            markers.push(marker);
        }
        // Create a layer group made from the bike markers array, pass it into the createMap function
        createMap(L.layerGroup(markers),L.layerGroup(markers) );

    }

    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);
    
    
    