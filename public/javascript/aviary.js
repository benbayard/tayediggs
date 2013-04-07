var featherEditor = new Aviary.Feather({
  apiKey: 'S7yq6lbq6EGx4BMJSVu_UA',
  apiVersion: 2,
  tools: ['enhance', 'focus', 'brightness', 'warmth'],
  minimumStyling: false,
  maxSize: 300,
  onSaveButtonClicked: function(){
     featherEditor.getImageData(function(data) {
        console.log(data);
//        window.open(data);
        featherEditor.close();
        
        var image = new Image();
        image.onload = function(){
          var cnv = document.getElementById('canvas');
          cnv.width = image.width;
          cnv.height = image.height;
          var ctx = cnv.getContext('2d');
          ctx.drawImage(image, 0, 0);
          
        }
        image.src = data;
      });
    return false;
  },
  onSave: function(imageID, newURL) {
    //var img = document.getElementById(imageID);
    //img.src = newURL;
    featherEditor.getImageData(function(data) {
      console.log(data);
      var ctx = document.getElementById('canvas').getContext('2d');
      ctx.drawImage(data, 0, 0);
    });
    // var imgToSave = canvas.toDataURL();
    // 
    // var ctx = document.getElementById('canvas').getContext('2d');
    // var img = document.getElementById(imageID);
    // var pageHeight = $(window).height();
    // img.src = newURL;
    // img.onload = function() {
    //     console.log(img.width);
    //     console.log(img.height);
    //     $("canvas").css("zoom", pageHeight/img.height);
    //     document.getElementById('canvas').height = img.height;
    //     document.getElementById('canvas').width = img.width;
    //     ctx.drawImage(img, 0, 0);
    // 
    //     // console.log(document.getElementById('canvas').height);
    //     console.log('the image is drawn');
    // }
  },
  postUrl: 'http://example.com/featherposturl'
});

function launchEditor(id, src) {
  window.scrollTo(0,1);
  if (!src) {
    featherEditor.launch({
      image: id
        });
    
  } else {
  featherEditor.launch({
    image: id,
    url: src
  });
  }
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