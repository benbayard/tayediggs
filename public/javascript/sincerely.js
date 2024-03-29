function SincerelyAdapter() {
  this.appKey = "FCB5TYIS2I29RLB7TNC9HU87D16JL4H7CHE8LFBQ";
  this.postUrl = "https://snapi.sincerely.com/shiplib/upload";
  /*
   * Usage
   * -----
   * var s = new SincerelyAdapter();
   * var dataURL = canvas.toDataURL("image/png");
   * s.upload(dataURL);
   */
  this.upload = function(dataURL) {
    var parent = this;
    var postURL = parent.postUrl + "?appkey="+parent.appKey+"&photo="+dataURL;
    console.log("SincerelyAdapter postURL: " + postURL);
    $.ajax({
      type: 'POST',
      url: postURL,
      dataType: "json"
    })
    .done(function(data) {
      console.log("$.ajax() success");
      console.log(data);
    })
    .fail(function(data) {
      console.log("$.ajax() FAIL");
    })
    .always(function(data) {
      console.log("$.ajax() always");
    });
  };
  // Credit for this function goes to http://stackoverflow.com/questions/934012/get-image-data-in-javascript
  this.getBase64Image = function(img) {
    var parent = this;
    
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return parent.replaceDataURLHeaders(dataURL);
  };
  this.replaceDataURLHeaders = function(dataURL) {
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    //return dataURL.replace(/^data:image\/(png|jpg);/, "");
  };
}

$(document).ready(function() {
  s = new SincerelyAdapter();
  canvas = document.getElementById("canvas");
  dataURL = canvas.toDataURL();
}); 