$(function() {

  var Photo = Backbone.Model.extend({
    initialize: function() {
      // set attributes if necessary
    }
  });

  var Camera = Backbone.View.extend({
    initialize: function() {
      // bind events to dom elements
    }
  });

  var PhotoView = Backbone.View.extend({
    initiailize: function() {
      
    }
  });

  var Map = Backbone.View.extend({
    initialize: function() {
      // fetch photos
      // plot on map
      // bind events to dom elements
    }
  });

  var Authenticate = Backbone.View.extend({
    initialize: function() {
      //
    }
  });

  var App = Backbone.View.extend({
  	initialize: function() {
      // start up screen
      // check if authenticated, send to authentication or map
    }
  });

  var app = new App;

});