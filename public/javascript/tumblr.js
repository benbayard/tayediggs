function TumblrAdapter() {
  this.oauth_consumer_key = "m5ullCnVK24E87WPwaLRZz6jRJ8gd1T2wMaOpP2zlP2ofBodJw";
  this.getAccessToken = function() {
    var parent = this;
    var postData = {};
    var headerData = {
      "Authorization": "oauth_consumer_key='" + parent.oauth_consumer_key + "',oauth_signature_method='HMAC-SHA1',oauth_callback='http://elephoto.co'"
    }
    $.ajax({
      type: "POST",
      url: "http://www.tumblr.com/oauth/request_token",
      headers: headerData
    })
    .done(function() {
      console.log("post success");
    })
    .fail(function() {
      console.error("post failure");
    })
    .always(function() {
      console.log("post always");
    });
  };
}
$(document).ready(function() {
  ta = new TumblrAdapter();
});