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
      // bind events to dom elements
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
      // bind events to dom elements
    }
  });

  // Authentication and control imgur credentials
  var Authenticate = Backbone.View.extend({
    initialize: function() {
      // 
    }
  });

  // ********
  // APP VIEW

  var AppView = Backbone.View.extend({
  	initialize: function() {
      // start up screen
      // check if authenticated, send to authentication or gallery
      console.log("BURGER TRAMPOLINE");
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
    }
  });

  // ****
  // INIT

  var app = new Router;

});