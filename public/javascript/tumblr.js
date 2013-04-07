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
