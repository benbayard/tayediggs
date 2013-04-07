var featherEditor = new Aviary.Feather({
  apiKey: 'S7yq6lbq6EGx4BMJSVu_UA',
  apiVersion: 2,
  tools: ['enhance', 'focus', 'brightness', 'warmth'],
  minimumStyling: false,
  maxSize: 300,
  onSave: function(imageID, newURL) {
    var img = document.getElementById(imageID);
    img.src = newURL;
  },
  postUrl: 'http://example.com/featherposturl'
});

function launchEditor(id, src) {
  window.scrollTo(0,1);
  featherEditor.launch({
    image: id,
    url: src
  });
  return false;
}

/*
var ctx = document.getElementById('canvas').getContext('2d');
var img = new Image;
img.src = window.webkitURL.createObjectURL(e.target.files[0]);
img.onload = function() {
  ctx.drawImage(img, 0, 0, img.width, img.height);
  document.getElementById("canvas").width = img.width;
  document.getElementById("canvas").height = img.height;
  console.log('the image is drawn');
}
*/

// var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];