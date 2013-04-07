$(function() {

  // *******
  // GLOBALS

  var Globals = {};

  Globals.authenticated = false;
  Globals.imgurResponse = false;
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
      console.log(this.attributes);
    }
  });

  var Venue = Backbone.Model.extend({
    initialize: function() {
    }
  });

  // ***********
  // COLLECTIONS

  var Photos = Backbone.Collection.extend({
    model: Photo,

    initialize: function() {
      
    },

    fetch: function() {
      console.log("setting collection");

      Imgur.findAlbum();
      this.set(Imgur.currentAlbum.images);

      console.log(this);

      this.view.addAll();
    }
  });

  var Locations = Backbone.Collection.extend({
    model: Venue,

    initialize: function() {

    },

    fetch: function() {
      console.log("setting location collection");

      this.set(Foursquare.venueResponse.venues);

      console.log(this);

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

      // MAP DETAILS .camera-map
      var map_node_selector = ".camera-map";
      var map_node = $(map_node_selector);
      MapboxPhd.setupMap(map_node_selector);
      Coordinates.setCoordinates(MapboxPhd.init, null);
      console.log(Coordinates)
      MapboxPhd.init({lat: Coordinates.lat, lon: Coordinates.lon})
      
      $(map_node_selector).append("<input type='hidden' id='lat-long'>");
      $("#lat-long").val(Coordinates.lat.toString() + "," + Coordinates.lon.toString());

      this.bind();
    },

    bind: function() {
      $(".camera-submit").on('click', function() {
        var caption = $(".camera-caption").val();
        var coords =  "DUMMY DATA"; // TODO: get geolocation stuff from matt

        $.cookie("image_title", caption);

        var tempData = coords + "*" + caption;
        // Save to WebSQL
        // Imgur.anonImg(tempData);
        try {
          var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        } catch(e) {
          var img = canvas.toDataURL().split(',')[1];
        }
        websql.setAnonymousImageURL(img);

        setTimeout(function() {
          Imgur.authorize();
        }, 1000); // god this is stupid

        // Authenticate!
        // Imgur.share(caption, coords, function() {
        //   console.log("data");
        // });
      });
      $(".camera-foursquare").on('click', function() {
        var locations = new Locations();
        var fslocations = new FSLocations({collection: locations});
      });
      $(".camera-edit").on('click', function() {
        //var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
          var dataUrl = canvas.toDataURL();
/*
        featherEditor.getImagerData(function(data){
          //data
        })*/
        debugger;
        document.getElementById('test').src = dataUrl;
        launchEditor("test", null);
      });
    }
  });

  // Pick a foursquare location in an attempt to alleviate your neverending pain
  var FSLocation = Backbone.View.extend({
    template: _.template($("#location-template").html()),

    tagName: "a",

    className: "foursquare-location",

    render: function() {
      console.log("add FSLocation view");

      this.$el.html(this.template(this.model.attributes));
      this.$el.attr('id', this.model.get('id'));
      return this.$el;
    }
  });

  var FSLocations = Backbone.View.extend({
    initialize: function() {
      // fetch venues
      this.collection.view = this;
      this.collection.fetch();
    },

    addAll: function() {
      console.log("FSLocations view add venues");

      var node = $("<div>");
      node.attr('class', 'location-list');

      node.append($("#location-chrome").html());

      this.collection.models.forEach(function(item) {
        var itemView = new FSLocation({model: item});
        node.append(itemView.render());
      });

      $("body").addClass("noscroll");
      $("#wrapper").addClass("noscroll");
      $("#wrapper").after(node);

      this.bind();
    },

    bind: function() {
      var that = this;

      $(".foursquare-location").on('click', function() { that.close() });
      $(".location-back").on('click', function() { that.close() });
    },

    close: function() {
      $("body").removeClass("noscroll");
      $("#wrapper").removeClass("noscroll");
      $(".location-list").remove();
    }
  });

  // View single photo details + share?
  var PhotoView = Backbone.View.extend({
    template: _.template($('#photo-template').html()),

    initialize: function() {
      console.log(this.model);

      this.render();
    },

    render: function() {
      var node = $("<div>");
      var photoBg = this.model[0].get("link");

      node.attr('class', 'photo-view');
      node.html(this.template(this.model[0].attributes));
      node.attr('style', 'background-image: url("' + photoBg + '")');

      $("body").addClass("noscroll");
      $("#wrapper").addClass("noscroll");
      $("#wrapper").after(node);

      this.bind();
    },

    bind: function() {
      var that = this;

      $(".photo-back").on('click', that.close);
    },

    close: function() {
      $("body").removeClass("noscroll");
      $("#wrapper").removeClass("noscroll");
      $(".photo-view").remove();
    }
  });

  // View single photo stub within gallery
  var PhotoStubView = Backbone.View.extend({
    template: _.template($('#photo-stub-template').html()),

    tagName: "article",

    className: "photo-stub-view",

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.$el.attr('id', this.model.get('id'));
      return this.$el;
    }
  });

  // View gallery of photos (this is a collection view!)
  var Gallery = Backbone.View.extend({
    el: $("#wrapper"),

    initialize: function() {
      // fetch photos
      this.collection.view = this;
      this.collection.fetch();
    },

    addAll: function() {
      var node = $("<div>");

      this.collection.models.forEach(function(item) {
        var itemView = new PhotoStubView({model: item});
        node.append(itemView.render());
      });

      console.log(this.$el);

      this.$el.addClass("gallery-view"); // set wrapper visible
      this.$el.html(node);

      this.bind();
    },

    bind: function() {
      var that = this;

      $(".photo-stub-view").on('click', function() {
        var photoId = $(this).attr('id');
        var model = that.collection.where({id: photoId});
        console.log(model);

        var photoView = new PhotoView({model: model});
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

      var imageCookie = $.cookie("image_title");

      console.log(Globals.imgurCreds)
      Imgur.findAlbum(function() {
        var checkAlbums = [];
        websql.getAlbums(checkAlbums);
        if (checkAlbums.length === 0) {
          websql.createNewAlbum("elephoto", Imgur.accessToken);
        }
        websql.getAnonymousImageURL(Globals.tempPhoto, function(urlArray) {
          console.log(urlArray);
          Imgur.addImageToAlbumFromCanvas(urlArray[0], "", imageCookie, function() {
            Imgur.findAlbum(function() {
              var photos = new Photos();
              var gallery = new Gallery({collection: photos});
            })
          });
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

      if (Globals.imgurResponse === false) {
        $("#wrapper").attr("class", "start-screen");

        this.bind();
      }

      $("body").addClass('noscroll');

      // MAP VIEW
      var map_node_selector = ".start-screen"
      var map_node = $(map_node_selector)
      MapboxPhd.setupMap(map_node_selector);
      Coordinates.setCoordinates(MapboxPhd.init, null);
    },

    bind: function() {
      $("#start-camera").on('click', function() {
        var camera =  new Camera();
      });
      $("#start-gallery").on('click', function() {
        var photos = new Photos();
        var gallery = new Gallery({collection: photos});
      });
    }
  });

  // ******
  // ROUTER

  var Router = Backbone.Router.extend({
    initialize: function() {
      // websql.getUsername(function(un) {
      //   console.log(un);
      //   if(un.length > 0) {
      //     console.log("There is a Username in the DB");
      //     Globals.authenticated = true;
      //   }

      // if there's a hash, then it's an Imgur callback
      if(window.location.hash !== "") {
        $("body").addClass("gallery-view");

        Globals.authenticated = true;
        Globals.imgurResponse = true;
        var auth = new Authenticate();
        auth.catchToken();
      }
      // }, function(un) {
      //   console.log("can't even get websql connecting");
      // });

      console.log("authenticated: " + Globals.authenticated);
      console.log("imgur response: " + Globals.imgurResponse);

      var appView = new AppView();
    }
  });

  // ****
  // INIT

  Backbone.history.start({pushState: true});

  var app = new Router;

});