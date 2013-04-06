var Imgur = {
  clientId: "7a2fd82ffa89750",
  responseType: "token",
  benTempAccessToken: "6663606e9362cb025a78a1078300e4afe24e8d23",
  setup: function() {
    //set up imgur stuff
    var input = document.getElementById('picture');
    input.addEventListener('change', this.handleFiles);
  },
  formImgurAuthUrl: function() {
    var base = "https://api.imgur.com/oauth2/authorize?"
    return  base +
            "client_id=" + this.clientId + "&" +
            "response_type=" + this.responseType

  },
  authorize: function() {
    window.location = this.formImgurAuthUrl();
  },
  handleFiles: function(e) {
    var ctx = document.getElementById('canvas').getContext('2d');
    var img = new Image;
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function() {
        ctx.drawImage(img, 20,20);
        console.log('the image is drawn');
    }
  },
  share: function() {
    try {
        var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    } catch(e) {
        var img = canvas.toDataURL().split(',')[1];
    }
    // open the popup in the click handler so it will not be blocked
    var w = window.open();
    w.document.write('Uploading...');
    // upload to imgur using jquery/CORS
    // https://developer.mozilla.org/En/HTTP_access_control
    $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'POST',
        data: {
            type: 'base64',
            // get your key here, quick and fast http://imgur.com/register/api_anon
            key: this.clientId,
            name: 'neon.jpg',
            title: 'test title',
            caption: 'test caption',
            image: img
        },
        headers: {
          Authorize: "Bearer 40cdd9550666648c53da7c5be09873c756ff94e3"
        },
        dataType: 'json'
    }).success(function(data) {
        w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
        alert('Could not reach api.imgur.com. Sorry :(');
        w.close();
    });
  }
}

$(document).ready(function() {
  Imgur.setup();
});