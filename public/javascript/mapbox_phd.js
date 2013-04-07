var MapboxPhd = {
  
  // selector is a string
  // callback is a function
  setupMap: function(selector) {
    $(selector).append("<div id='map'></div>");
  },
  
  init: function(param) {
    var lat = param.lat;
    var lon = param.lon;
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

function geoSuccess(p) {
  alert("Found you at latitude " + p.coords.latitude +
        ", longitude " + p.coords.longitude);
}

function geoError() {
  alert("Could not find you!");
}

$(document).ready(function() {
  MapboxPhd.setupMap("body");
  Coordinates.setCoordinates(MapboxPhd.init, null);
  
  // MapboxPhd.setup(coordinates.lat, coordinates.lon);
});