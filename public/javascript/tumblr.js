function TumblrAdapter() {
  this.oauth_consumer_key = "m5ullCnVK24E87WPwaLRZz6jRJ8gd1T2wMaOpP2zlP2ofBodJw";
  this.oauth_consumer_secret = "xrA3XIwrBg9tetaWaW1fBP3Ookmtf3rXVAZo8oIx5EAqPaOvJA";
  this.requestToken = function(imageURL) {
    var parent = this;
    $.ajax({
      type: 'GET',
      url: "/oauth/request",
      headers: {
        Authorization: "OAuth oauth_consumer_key='"+parent.oauth_consumer_key+"', oauth_consumer_secret='"+parent.oauth_consumer_secret+"'"
      },
      data: {
        image_url: imageURL
      },
      dataType: "json"
    })
    .done(function() {
      console.log("requestToken success");
    })
    .fail(function() {
      console.log("requestToken fail");
    });
  };
}
$(document).ready(function() {
  ta = new TumblrAdapter();
});
/*
Usage
=====
Step 1 : Create a tumblr button div
-----------------------------------
<div id="tumblr_button"></div>

Step 2: Instantiate and set the sharing parameters
--------------------------------------------------
var tbh = new TumblrButtonHelper();
tbh.photo_source = "http://image-source.com/image.png"
tbh.photo_caption = "My zany caption"

Step 3: OPTIONAL - Set the display text
---------------------------------------
tbh.setButtonInnerHTML("Booyah");

Step 4: Final HTML structure
----------------------------
<div id="tumblr_button">
  <a href="http://www.tumblr.com/share/photo?v=3&.....">Share</a>
</div>

*/
function TumblrButtonHelper() {
  this.photo_source = "";
  this.photo_caption = "";
  var tumblr_button;
  this.build = function() {
    var parent = this;
    tumblr_button = document.createElement("a");
    tumblr_button.setAttribute("href", "http://www.tumblr.com/share/photo?v=3&source=" + encodeURIComponent(parent.photo_source) + "&caption=" + encodeURIComponent(parent.photo_caption));
    tumblr_button.setAttribute("title", "Share on Tumblr");
    tumblr_button.innerHTML = "Share";
    document.getElementById("tumblr_button").appendChild(tumblr_button);
  };
  this.setButtonInnerHTML = function(html) {
    var parent = this;
    tumblr_button.innerHTML = html;
  }
}