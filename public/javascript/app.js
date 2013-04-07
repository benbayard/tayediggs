$(function() {

  // *******
  // GLOBALS

  var Globals = {};

  Globals.authenticated = false;
  Globals.logging = true;

  Globals.tempPhoto = [];

  Globals.hideStartScreen = function() {
    $("#start-camera").addClass("hide");
    $("#wrapper").attr('class', '');
  }

  // ******
  // MODELS

  var Photo = Backbone.Model.extend({
    initialize: function() {
      console.log("init photo");
    }
  });

  // ***********
  // COLLECTIONS

  var Photos = Backbone.Collection.extend({
    model: Photo,

    initialize: function() {

    },

    fetch: function() {
      // dummy data
      var photos = [];
      for(var i = 0; i < 8; i++) {
        var photo = {};
        photo.id = i;
        photo.dummy_attribute = "yes";
        this.add(photo);
      }

      this.view.addAll();
    }
  });

  // *****
  // VIEWS

  // Start camera API and control imgur uploading
  var Camera = Backbone.View.extend({
    initialize: function() {
      $("#picture").on('change', function() {
        var details = new CameraDetails();
        Globals.hideStartScreen();
      });
    },
  });

  // Edit new photo details
  var CameraDetails = Backbone.View.extend({
    el: $("#wrapper"),

    template: _.template($('#camera-details-template').html()),

    initialize: function() {
      this.render();
    },

    render: function() {
      var node = $("<div>");

      node.html(this.template());

      this.$el.html(node);

      // animate overlay up);
      setTimeout(function() {
        $(".camera-overlay").addClass('animate');
      }, 1500);

      this.bind();
    },

    bind: function() {
      $(".camera-submit").on('click', function() {
        var caption = $(".camera-caption").val();
        var coords =  "DUMMY DATA"; // TODO: get geolocation stuff from matt

        var tempData = coords + "*" + caption;
        // Save to WebSQL
        // Imgur.anonImg(tempData);
        try {
          var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        } catch(e) {
          var img = canvas.toDataURL().split(',')[1];
        }
        websql.setAnonymousImageURL(img);

        Imgur.authorize();

        // Authenticate!
        // Imgur.share(caption, coords, function() {
        //   console.log("data");
        // });
      })
    }
  });

  // View single photo details + share?
  var PhotoView = Backbone.View.extend({
    template: _.template($('#photo-template').html()),

    initialize: function() {
      
    }
  });

  // View single photo stub within gallery
  var PhotoStubView = Backbone.View.extend({
    template: _.template($('#photo-stub-template').html()),

    intitialize: function() {
      console.log(this.model);
    },

    render: function() {

    }
  });

  // View gallery of photos (this is a collection view!)
  var Gallery = Backbone.View.extend({
    el: $("wrapper"),

    initialize: function() {
      // fetch photos
      this.collection.view = this;
      this.collection.fetch();
    },

    addAll: function() {
      this.collection.models.forEach(function(item) {
        console.log("iterating?");
        var itemView = new PhotoStubView({model: item});
      });
    }
  });

  // Authentication and control imgur credentials
  var Authenticate = Backbone.View.extend({
    el: $("#wrapper"),

    initialize: function() {
      console.log("--> initialized Authenticate");

      // TODO: check on authentication and redirect to gallery
    },

    render: function() {
      console.log("--> rendered Authenticate");
      console.log(this);

      var node = $("<a>");
      node.attr('id', 'imgur-authorize');
      node.html("Authenticate");
      this.$el.html(node);

      this.bind();
    },

    bind: function() {
      $("#imgur-authorize").on('click', function() {
        Imgur.authorize();
      });
    },

    catchToken: function() {
      console.log("--> catching token in Authenticate");
      Globals.imgurCreds = {};

      // store all of the things (where things are imgur creds)
      Globals.imgurCreds.access_token = this.getQueryVariable("access_token");
      Globals.imgurCreds.expires_in = this.getQueryVariable("expires_in");
      Globals.imgurCreds.token_type = this.getQueryVariable("token_type");
      Globals.imgurCreds.refresh_token = this.getQueryVariable("refresh_token");
      Globals.imgurCreds.account_username = this.getQueryVariable("account_username");

      websql.setUsername(Globals.imgurCreds.account_username);
      Imgur.currentUser = Globals.imgurCreds.account_username;
      Imgur.accessToken = Globals.imgurCreds.access_token;

      console.log(Globals.imgurCreds);

      Imgur.findAlbum(function() {
        var checkAlbums = [];
        websql.getAlbums(checkAlbums);
        if (checkAlbums.length === 0) {
          websql.createNewAlbum("elephoto", Globals.imgurCreds.access_token);
        }
        websql.selectAlbum("elephoto");

        Imgur.setAccessToken(Globals.imgurCreds.access_token);

        websql.getAnonymousImageURL(Globals.tempPhoto, function(urlArray) {
          console.log(urlArray);
          Imgur.addImageToAlbumFromCanvas(urlArray[0]);
        });
      });
    },

    getQueryVariable: function(variable) {
      var query = window.location.hash.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
    }
    
  });

  // ********
  // APP VIEW

  var AppView = Backbone.View.extend({
    el: $("#wrapper"),

  	initialize: function() {
      console.log("BURGER TRAMPOLINE!");

      // start up screen
      this.render();
    },

    render: function() {
      // TODO: fetch and add scrolling maps?
      // (or we might just use static images)

      if (Globals.authenticated === false) {
        $("#wrapper").attr("class", "start-screen");

        this.bind();
      }
    },

    bind: function() {
      $("#start-camera").on('click', function() {
        var camera =  new Camera();
      });
      $("#start-gallery").on('click', function() {
        var photos = new Photos();
        var gallery = new Gallery({collection: photos});
      });

      // make sure you can't scroll the webapp
      // $("#wrapper").on('touchstart', function(e) { 
      //   e.preventDefault(); 
      // });
    }
  });

  // ******
  // ROUTER

  var Router = Backbone.Router.extend({
    initialize: function() {
      // if there's a hash, then it's an Imgur callback
      if(window.location.hash !== "") {
        Globals.authenticated = true;
        var auth = new Authenticate();
        auth.catchToken();
      }

      // TODO: check for prior authentication

      var appView = new AppView();
    }
  });

  // ****
  // INIT

  Backbone.history.start({pushState: true});

  var app = new Router;

});