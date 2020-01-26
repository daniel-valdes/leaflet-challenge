// Last 7 days global earthquake data API Request
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var plate_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data);
    
});

// d3.json(plate_url, function(data) {

//     var plates = L.geoJSON(data)

//     createMap(plates)

// });

function createFeatures (data) {

    function onEachFeature(feature, layer) {

        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p> Magnitude: " +
        feature.properties.mag + "</p>")

    }

    function styleFunc(feature) {

        return {
            radius: feature.properties.mag * 6,
            fillColor: getColor(feature.properties.mag),
            color: "black",
            opacity: 1,
            fillOpacity: 0.8
        }
        
        function getColor(d) {
            return d > 5 ? '#DC143C' :
                d > 4 ? '#f0936b' :
                d > 3 ? '#f3ba4e' :
                d > 2 ? '#f3db4c' :
                d > 1 ? '#e1f34c' :
                        '#b7f34d';
        }
    
    };


    var earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: styleFunc
    });
    
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create first base layer
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: "pk.eyJ1Ijoic2xvYW5qYSIsImEiOiJjazVlaGd0N20yN2pjM2dvMzMxYjN2cGNhIn0.0AH7IJF8d9BIxM9BgZKy0A"
    });

    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: "pk.eyJ1Ijoic2xvYW5qYSIsImEiOiJjazVlaGd0N20yN2pjM2dvMzMxYjN2cGNhIn0.0AH7IJF8d9BIxM9BgZKy0A"
    });

    // Map layer
    var baseMaps = {
        "Satellite Map": satellite,
        "Light Map": light
    }

    // Marker layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        // Plates: plates
    }

    // Create initial map object
    var myMap = L.map("map", {
        center: [37.964,-98.8318],
        zoom: 3.5,
        layers: [satellite, earthquakes]
    });
        
        
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap)
}