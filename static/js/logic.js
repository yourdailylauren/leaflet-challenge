// Creating map object
var myMap = L.map("map", {
    center: [20, 140], // Roughly centered for Pacific Ring of Fire region
    zoom: 2 // Zoomed out to show more of the earth
  });  
  
  // Adding tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(myMap);
  
  // Function to determine marker size based on earthquake magnitude
  function markerSize(magnitude) {
    return magnitude * 4; // Adjust as necessary
  }
  
  // Function to determine marker color based on earthquake depth
  function markerColor(depth) {
    return depth > 90 ? '#ff0000' :
           depth > 70 ? '#ff6600' :
           depth > 50 ? '#ffcc00' :
           depth > 30 ? '#ffff00' :
           depth > 10 ? '#ccff33' :
                        '#66ff33'; // Adjust as necessary
  }
  
  // Function to add features to each marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + 
      "<br>Depth: " + feature.geometry.coordinates[2] + " km</p>");
  }
  
  // URL to the GeoJSON data
  var geojsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
  
  // Grabbing our GeoJSON data..
  d3.json(geojsonUrl).then(function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    }).addTo(myMap);
  });
  
  // Set up the legend
  var legend = L.control({ position: 'bottomright' });
  
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
  
    // Array of depth intervals and their corresponding colors
    var depths = [-10, 10, 30, 50, 70, 90];
    var colors = [
      '#66ff33', '#ccff33', '#ffff00', '#ffcc00', '#ff6600', '#ff0000'
    ];
  
    // Loop through intervals and create a label with a colored square for each
    depths.forEach(function(depth, index) {
      var range = depth + (depths[index + 1] ? '&ndash;' + depths[index + 1] + ' km' : '+ km');
      var color = colors[index];
  
      var item = L.DomUtil.create('div', null, div);
      var square = L.DomUtil.create('i', null, item);
      square.style.backgroundColor = color; // Set the background color
  
      var text = L.DomUtil.create('span', null, item);
      text.innerHTML = range;
    });
  
    return div;
  };
  
  
  // Adding legend to the map
  legend.addTo(myMap);
  