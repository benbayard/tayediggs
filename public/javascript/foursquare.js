var Foursquare = {
  // Venue Response
  
  venueResponse: "",
  setup: function () {
    
  },
  
  setVenueResponse: function(coords) {
    var mattTempAccessToken = "XL5FDDKXVEM2PXJH2GJ2LG0J00M4I50FXB55RRZGHYMHNCU5";
    var oauthversion = "20130406";
    $.ajax({
      url: "https://api.foursquare.com/v2/venues/search?ll=" + coords 
      + "&oauth_token=" + mattTempAccessToken 
      + "&v=" + oauthversion,
      type: "GET",
    }).success(function(data) {
      console.log(data)
    }).error(function() {
      alert('setVenueResponse: FAIL!!!! damn you foursquare!');
    });
  }
  
  
}
$(document).ready(function() {
  var test_coords = "51.505,-0.09"
  // Foursquare.setup();
});