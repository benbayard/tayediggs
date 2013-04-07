var Imgur = {
  clientId: "7a2fd82ffa89750",
  responseType: "token",
  currentAlbum: {},
  accessToken: "",
  currentUser: "",
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
    var pageHeight = $(window).height();
    img.src = window.webkitURL.createObjectURL(e.target.files[0]);
    img.onload = function() {
        console.log(img.width);
        console.log(img.height);
        $("canvas").css("zoom", pageHeight/img.height);
        document.getElementById('canvas').height = img.height;
        document.getElementById('canvas').width = img.width;
        ctx.drawImage(img, 0, 0);

        // console.log(document.getElementById('canvas').height);
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
        Authorization: "Bearer " + Imgur.accessToken
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
  addImageToAlbumFromCanvas: function(id, description, title, success) {
    title = "BLAH DE BLAH";
    description = "THIS DESCRIBES ME";
    // console.log(id);
    $.ajax({
      url: "https://api.imgur.com/3/image",
      type: 'POST',
      data: {
          type: 'base64',
          // get your key here, quick and fast http://imgur.com/register/api_anon
          key: Imgur.clientId,
          name: title + '.jpg',
          title: title,
          album: Imgur.currentAlbum.id,
          image: id
      },
      headers: {
        Authorization: "Bearer " + Imgur.accessToken
      },
      dataType: 'json'
    }).success(function(data) {
        // console.log(data);
        var the_id = data.data.id;
        if(success) {
          success()
        }
        return data.data;
        // w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
        alert('Could not reach api.imgur.com. Sorry :(');
    });
    // var ctx = document.getElementById('canvas').getContext('2d');
    // var img = new Image;
    // var pageHeight = $(window).height();
    // img.src = data.data.link;
    // console.log(img);
    // img.onload = function() {
    //   console.log(img.width);
    //   console.log(img.height);
    //   $("canvas").css("zoom", pageHeight/img.height);
    //   document.getElementById('canvas').height = img.height;
    //   document.getElementById('canvas').width = img.width;
    //   ctx.drawImage(img, 0, 0);
    //   console.log('the image is drawn');
    //   try {
    //       var newImg = document.getElementById('canvas').toDataURL('image/jpeg', 0.9).split(',')[1];
    //   } catch(e) {
    //       var newImg = document.getElementById('canvas').toDataURL().split(',')[1];
    //   }
    //   console.log(newImg);
    //   $.ajax({
    //     url: "https://api.imgur.com/3/image",
    //     type: 'POST',
    //     data: {
    //         type: 'base64',
    //         // get your key here, quick and fast http://imgur.com/register/api_anon
    //         key: Imgur.clientId,
    //         name: title + '.jpg',
    //         title: title,
    //         album: Imgur.currentAlbum.id,
    //         image: newImg
    //     },
    //     headers: {
    //       Authorization: "Bearer " + Imgur.accessToken
    //     },
    //     dataType: 'json'
    //   }).success(function(data) {
    //       console.log(data);
    //       var the_id = data.data.id;
    //       return data.data;
    //       // w.location.href = data['upload']['links']['imgur_page'];
    //   }).error(function() {
    //       alert('Could not reach api.imgur.com. Sorry :(');
    //   });

    // }
  },
  fetchAlbums: function(success) {
    $.ajax({
      url: "https://api.imgur.com/3/account/" + Imgur.currentUser + "/albums/ids",
      type: 'GET',
      data: {
        key: Imgur.clientId
      },
      headers: {
        Authorization: "Bearer " + Imgur.accessToken
      },
    dataType: 'json'
    }).success(function(data) {
      // console.log(data.data);
      //return the list of ids
      // return data.data;
      if (success) {
        success(data.data)
      }
      // w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
      console.log("Bearer " + Imgur.accessToken);
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
          Authorization: "Bearer " + Imgur.accessToken
        },
        dataType: 'json'
    }).success(function(data) {
        // console.log(data);
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
          // console.log(specs);
          if(specs.title === "elephoto") {
            // console.log("THIS IS THE IMGUR ALBUM YALL" + specs.id);
            album = specs;
          }
          if (specs.id == albums[albums.length - 1]) {
            // console.log(album);
            if (album.title == "elephoto") {
              console.log("AN ALBUM EXISTS!");
              // return album;
              that.currentAlbum = album;
              if (success) {
                success(album);
              }
              // websql.setAlbumId(album.id);
            } else {
              console.log("AN ALBUM DOES NOT EXIST");
              return that.createAlbum(success);
            }
          }
        });
      }

    });
  },
  anonImg: function(title) {
    try {
      var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    } catch(e) {
      var img = canvas.toDataURL().split(',')[1];
    }
    $.ajax({
      url: 'https://api.imgur.com/3/image',
      type: 'POST',
      data: {
          type: 'base64',
          // get your key here, quick and fast http://imgur.com/register/api_anon.
          title: title,
          image: img
      },
      headers: {
        Authorization: "Client-ID " + Imgur.clientId
      },
      dataType: 'json'
    }).success(function(data) {
      // console.log(data.data);
      websql.setAnonymousImageURL(data.data.id);
    }
    // }).error(function() {
    //   alert('Could not reach api.imgur.com. Sorry :(');
    // });
  },
  share: function(title, caption, success) {
    try {
        var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    } catch(e) {
        var img = canvas.toDataURL().split(',')[1];
    }
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
            title: title,
            caption: caption,
            image: img
        },
        headers: {
          Authorization: "Bearer " + Imgur.accessToken
        },
        dataType: 'json'
    }).success(function(data) {
        if(success) {
          success(data);
        }
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