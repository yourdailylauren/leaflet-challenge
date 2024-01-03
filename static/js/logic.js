// Creating map object
var myMap = L.map("map", {
    center: [20, 140], // center above a more uniform area
    zoom: 2 // zoom out to show the whole area mapped
  });  
  
  // adding tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(myMap);
  
  // make marker size dependent on earthquake
  function markerSize(magnitude) {
    return magnitude * 4; 
  }
  
  // make color depending on depth
  function markerColor(depth) {
    return depth > 90 ? '#ff0000' :
           depth > 70 ? '#ff6600' :
           depth > 50 ? '#ffcc00' :
           depth > 30 ? '#ffff00' :
           depth > 10 ? '#ccff33' :
                        '#66ff33'; 
  }
  
  // add features to each marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + 
      "<br>Depth: " + feature.geometry.coordinates[2] + " km</p>");
  }
  
  // URL to the GeoJSON data
  var geojsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
  
  // grap JSON data
  d3.json(geojsonUrl).then(function(data) {
    // create a geoJSON layer with the data
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
  
  // set up the legend
  var legend = L.control({ position: 'bottomright' });
  
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
  
    // set up array of depth and their colors
    var depths = [-10, 10, 30, 50, 70, 90];
    var colors = [
      '#66ff33', '#ccff33', '#ffff00', '#ffcc00', '#ff6600', '#ff0000'
    ];
  
    // go through all intervals, color square for each
    depths.forEach(function(depth, index) {
      var range = depth + (depths[index + 1] ? '&ndash;' + depths[index + 1] + ' km' : '+ km');
      var color = colors[index];
  
      var item = L.DomUtil.create('div', null, div);
      var square = L.DomUtil.create('i', null, item);
      square.style.backgroundColor = color; 
  
      var text = L.DomUtil.create('span', null, item);
      text.innerHTML = range;
    });
  
    return div;
  };
  
  
  // adding legend to the map
  legend.addTo(myMap);
  