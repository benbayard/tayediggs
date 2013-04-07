var Imgur = {
  clientId: "7a2fd82ffa89750",
  responseType: "token",
  currentAlbum: {},
  accessToken: "",
  benTempAccessToken: "26ec92f50f44ed9d9c6d82200085025902fa0441",
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
  setAccessToken: function(token) {
    this.accessToken = token;
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
  fetchAlbum: function(id, success) {
    $.ajax({
      url: 'https://api.imgur.com/3/album/' + id,
      type: 'GET',
      data: {
        key: Imgur.clientId
      },
      headers: {
        Authorization: "Bearer " + Imgur.benTempAccessToken
      },
    dataType: 'json'
    }).success(function(data) {
      // console.log(data);
      if(success) {
        success(data.data);
      }
      // w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
      alert('Could not reach api.imgur.com. Sorry :(');
    });
  },
  addImageToAlbumFromCanvas: function(albumId) {
    //Get the canvas image.
    try {
        var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    } catch(e) {
        var img = canvas.toDataURL().split(',')[1];
    }
    console.log(img);
    $.ajax({
      url: 'https://api.imgur.com/3/image',
      type: 'POST',
      data: {
          type: 'base64',
          // get your key here, quick and fast http://imgur.com/register/api_anon
          key: Imgur.clientId,
          name: 'neon.jpg',
          title: 'test title',
          caption: 'test caption',
          image: img
      },
      headers: {
        Authorization: "Bearer " + Imgur.benTempAccessToken
      },
      dataType: 'json'
    }).success(function(data) {
        console.log(data)
        // w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
        alert('Could not reach api.imgur.com. Sorry :(');
        w.close();
        console.log({
            type: 'base64',
            // get your key here, quick and fast http://imgur.com/register/api_anon
            key: Imgur.clientId,
            name: 'img.jpg',
            title: 'test title',
            caption: 'test caption',
            image: img
        })
    });
  },
  fetchAlbums: function(success) {
    $.ajax({
      url: "https://api.imgur.com/3/account/benbayard/albums/ids",
      type: 'GET',
      data: {
        key: Imgur.clientId
      },
      headers: {
        Authorization: "Bearer " + Imgur.benTempAccessToken
      },
    dataType: 'json'
    }).success(function(data) {
      console.log(data.data);
      //return the list of ids
      // return data.data;
      if (success) {
        success(data.data)
      }
      // w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
      alert('Could not reach api.imgur.com. Sorry :(');
    });
  },
  createAlbum: function(success) {
    // API EndPoint: https://api.imgur.com/3/album/
    $.ajax({
        url: 'https://api.imgur.com/3/album/',
        type: 'POST',
        data: {
            type: 'base64',
            // get your key here, quick and fast http://imgur.com/register/api_anon
            key: Imgur.clientId,
            title: 'elephoto',
            description: 'test caption',
        },
        headers: {
          Authorization: "Bearer " + Imgur.benTempAccessToken
        },
        dataType: 'json'
    }).success(function(data) {
        console.log(data);
        if(success) {
          success(data);
        }
        return data.id;

        // w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
      alert('Could not reach api.imgur.com. Sorry :(');
    });
  },
  findAlbum: function(success) {
    var that = this;
    var album = {};
    this.fetchAlbums(function(albums) {
      for(var i = 0; i < albums.length; i++) {
        var album = albums[i];
        // console.log(album);
        that.fetchAlbum(album, function(specs) {
          console.log(specs);
          if(specs.title === "elephoto") {
            // console.log("THIS IS THE IMGUR ALBUM YALL" + specs.id);
            album = specs;
          }
          if (specs.id == albums[albums.length - 1]) {
            if (album.id) {
              console.log("AN ALBUM EXISTS!");
              // return album;
              that.currentAlbum = album;
            } else {
              console.log("AN ALBUM DOES NOT EXIST");
              // return that.createAlbum(success);
            }
          }
        });
      }

    });
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
            key: Imgur.clientId,
            name: 'neon.jpg',
            title: 'test title',
            caption: 'test caption',
            image: img
        },
        headers: {
          Authorization: "Bearer " + Imgur.benTempAccessToken
        },
        dataType: 'json'
    }).success(function(data) {
        console.log(data)
        // w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
        alert('Could not reach api.imgur.com. Sorry :(');
        w.close();
        console.log({
            type: 'base64',
            // get your key here, quick and fast http://imgur.com/register/api_anon
            key: Imgur.clientId,
            name: 'neon.jpg',
            title: 'test title',
            caption: 'test caption',
            image: img
        })
    });
  }
}

$(document).ready(function() {
  Imgur.setup();
});