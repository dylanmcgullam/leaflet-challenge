// store API endpoint as queryurl
var queryurl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// use get request to get data
d3.json(queryurl).then(function(data)  {
    createFeatures(data.features);
});


// create a function for the marker Size
function markerSize(magnitude) {
    return magnitude * 5000;
};

// create a function for the marker color
function chooseColor(depth)  {
    if (depth < 10) return "green";
  else if (depth < 30) return "orange";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "Darkgreen";
  else if (depth < 90) return "Darkorange";
  else return "Darkyellow";
}

// create the earthquakedata function
function createFeatures(earthquakeData)  {

    // now the pop-up function
    function onEachFeature(feature, layer)  {
        layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p>`);
    }

    // create layer to show the data
    var earthquakes = L.geoJSON(earthquakeData,  {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng)  {

            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                color: "gray",
                stroke: true,
                weight: 0.5
              }
              return L.circle(latlng,markers);
            }
          });
    
    createMap(earthquakes);
    
}

// create the map
function createMap(earthquakes)  {

    // begin with base layers
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
    
    // baseMap object
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
        };

    // create overlay object
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // create the map with streetmap and earthquake layers
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
        });

    // add legend for context of map data
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(myMap)  {
        var div = L.DomUtil.create('div', 'legend');
        var depths = [-10, 10, 30, 50, 70, 90];
        var colors = ['green', 'orange', 'yellow', 'Darkgreen', 'Darkorange', 'Darkyellow'];
    
    
        for (var i=0; i<depths.length; i++)  {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+")
        }

        return div;
    };

    legend.addTo(myMap);


    // create layer controls and add it to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);
        

}
