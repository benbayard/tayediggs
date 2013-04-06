$(function() {

  // **************
  // GLOBAL OPTIONS

  var Globals = {};

  Globals.authenticated = true;
  Globals.logging = true;

  // ******
  // MODELS

  var Photo = Backbone.Model.extend({
    initialize: function() {
      // set attributes if necessary
    }
  });

  // *****
  // VIEWS

  // Start camera API and control imgur uploading
  var Camera = Backbone.View.extend({
    initialize: function() {
      console.log("--> initialized Camera");

      $("#picture").click();
    }
  });

  // Edit new photo details
  var CameraDetails = Backbone.View.extend({
    initialize: function() {

    }
  });

  // View single photo details + share?
  var PhotoView = Backbone.View.extend({
    initiailize: function() {
      
    }
  });

  // View gallery of photos
  var Gallery = Backbone.View.extend({
    initialize: function() {
      // fetch photos
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
      node.attr('href', '#');
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
      console.log(getQueryVariable("access_token"));
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

      // if (Globals.authenticated === false) {
        $("#wrapper").attr("class", "start-screen");

        this.bind();
      // }
    },

    bind: function() {
      $("#start-camera").on('click', function() {
        var camera =  new Camera();
      });
      $("#start-auth").on('click', function() {
        var auth = new Authenticate();
        auth.render();
      });

      // make sure you can't scroll the webapp
      document.ontouchstart = function(e){ 
        e.preventDefault(); 
      }
    }
  });

  // ******
  // ROUTER

  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "photo/review": "reviewNewPhoto",
      "photo/edit": "editNewPhoto",
      "photo/caption": "captionNewPhoto",
    },

    initialize: function() {
      // TODO: check if we're authenticated

      console.log(Backbone.history.fragment);
      console.log(this.routes[Backbone.history.fragment]);
      var appView = new AppView();

      if(window.location.hash !== "") {
        var auth = new Authenticate();
        auth.catchToken();
      }
    },

    reviewNewPhoto: function() {
      console.log("--> routed to reviewNewPhoto");
    }
  });

  // ****
  // INIT

  Backbone.history.start({pushState: true});

  var app = new Router;

});