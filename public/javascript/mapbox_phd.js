function coordinates(latitude, longitude) {
  this.lat = latitude;
  this.lon = longitude;
}

var mapBox = {
  
  setup: function(lat, lon) {
    var map = mapbox.map('map');
    
    var retina = window.devicePixelRatio >= 2;
    if (retina) {
        // Retina tiles are sized 1/2 of normal tiles for twice the pixel
        // density
        map.tileSize = { x: 128, y: 128 };
        // use a retina tileset
        map.addLayer(mapbox.layer().id('examples.map-zq0f1vuc'));
    } else {
        // use a standard tileset
        map.addLayer(mapbox.layer().id('examples.map-vyofok3q'));
    }

    // Create and add marker layer
    var markerLayer = mapbox.markers.layer().features([{
        "geometry": { "type": "Point", "coordinates": [lon, lat]},
        "properties": { "image": "images/mapbox_marker.png" }
    }]).factory(function(f) {
    // Define a new factory function. This takes a GeoJSON object
    // as its input and returns an element - in this case an image -
    // that represents the point.
        var img = document.createElement('img');
        img.className = 'marker-image';
        img.setAttribute('src', f.properties.image);
        img.setAttribute('style', 'width: 45px; height: 45px');
        return img;
    });

    map.addLayer(markerLayer)
        .setExtent(markerLayer.extent());

    // Attribute map
    map.ui.attribution.add()
        .content('<a href="http://mapbox.com/about/maps" class="phd_terms">Terms &amp; Feedback</a>');
  }
}

$(document).ready(function() {
  // test_coords = [latitude, longitude];
  var test_coords = new coordinates(37.756144, -122.432568);
  mapBox.setup(test_coords.lat, test_coords.lon);
});