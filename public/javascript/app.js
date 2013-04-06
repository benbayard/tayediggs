$(function() {

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

      this.render();
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
        Imgur.formImgurAuthUrl();
        Imgur.authorize();
      });
    }
  });

  // ********
  // APP VIEW

  var AppView = Backbone.View.extend({
  	initialize: function() {
      console.log("BURGER TRAMPOLINE!");

      // start up screen
      var authenticate = new Authenticate();
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
      "catchtoken/:token": "catchToken"
    },

    initialize: function() {
      var appView = new AppView();
    }
  });

  // ****
  // INIT

  var app = new Router;

});