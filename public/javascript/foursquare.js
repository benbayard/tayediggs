function Venue(name, address) {
  this.name = name;
  this.address = address;
}

var Foursquare = {
  // Venue Response
  
  venueResponse: null,
  
  setup: function () {
    
  },
  
  setVenueResponse: function(coords, callback) {
    console.log("setVenueResponse called")
    var mattTempAccessToken = "XL5FDDKXVEM2PXJH2GJ2LG0J00M4I50FXB55RRZGHYMHNCU5";
    var oauthversion = "20130406";
    var latitude = coords.lat;
    var longitude = coords.lon;
    $.ajax({
      url: "https://api.foursquare.com/v2/venues/search?ll=" + latitude + "," + longitude
      + "&oauth_token=" + mattTempAccessToken 
      + "&v=" + oauthversion,
      type: "GET",
      dataType: 'json'
    }).success(function(data) {
      console.log("https://api.foursquare.com/v2/venues/search?ll=" + latitude + "," + longitude
      + "&oauth_token=" + mattTempAccessToken 
      + "&v=" + oauthversion)
      Foursquare.venueResponse = data.response;
      if (callback != null) {
        callback();
      }
    }).error(function() {
      alert('setVenueResponse: FAIL!!!! damn you foursquare!');
    });
  },
  
  // Return an array of venue objects (name and address of business)
  
  // Location object:
  //   address: "725 Littlefield Ave"
  //   cc: "US"
  //   city: "South San Francisco"
  //   country: "United States"
  //   distance: 234
  //   lat: 37.698091
  //   lng: -122.398873
  //   state: "CA"
  
  getVenues: function() {
    var venues = [];
    if (Foursquare.venueResponse !== null) {
      var i = 0;
      Foursquare.venueResponse.venues.forEach( function(el) {
        venues[i] = new Venue(el.name, el.location);
      });
    }
    window.myVenues = venues;
  }
  
}

$(document).ready(function() {
  // test_coords = [latitude, longitude];
  Coordinates.setCoordinates(Foursquare.setVenueResponse, Foursquare.getVenues);
});