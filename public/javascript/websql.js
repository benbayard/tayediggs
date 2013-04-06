/*
 * The websql variable is already initialized for the entire document (see bottom of file).
 *
 * Usage:
 * ------
 * websql.createNewAlbum("foo", "bar");
 * 
 */
var websql = {
  db: "",
  currentAlbumId: "",
  initialize: function() {
    var that = this;
    that.db = openDatabase("elephoto", "1.0", "Elephoto meta information storage database.", 2 * 1024 * 1024);
    that.db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS albums (albumId unique, authToken)', [], function(tx) {
        console.log("websql: initialize() success");
      }, function(tx) {
        console.log("websql: initialize() FAILURE");
      });
    });
  },
  getAlbums: function(albums) {
    var that = this;
    if (typeof(albums) !== "undefined" && typeof(albums) === "object") {
      that.db.transaction(function(tx) {
        tx.executeSql('SELECT albumId FROM albums', [], function(tx, results) {
          console.log("websql: getAlbums() success");
          console.log(albums);
          for (var i = 0; i < results.rows.length; i++) {
            albums[i] = results.rows.item(i).albumId;
          }
          console.log(albums);
        }, function(tx) {
          console.log("websql: getAlbums() FAILURE");
        });
      });
    } else {
      console.error("websql: you called getAlbums() without passing in a valid argument! getAlbums() requires an array.");
    }
  },
  selectAlbum: function(albumId) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('SELECT albumId FROM albums', [], function(tx, results) {
        console.log("websql: selectAlbum() callback success");
        var albums = [];
        for (var i = 0; i < results.rows.length; i++) {
          albums[i] = results.rows.item(i).albumId;
        }
        if (albums.length > 0) {
          var albumFound = false;
          for (var i = 0; i < albums.length; i++) {
            if (albums[i] === albumId) {
              albumFound = true;
            }
          }
          if (albumFound) {
            that.currentAlbumId = albumId;
            console.log("websql: selectAlbum() - Successfully selected a new album: " + that.currentAlbumId);
          } else {
            console.error("websql: selectAlbum() - There was no album found with albumId '" + albumId + "'");
          }
        } else {
          console.error("websql: selectAlbum() - There are no albums to select.");
        }
      }, function(tx) {
        console.log("websql: selectAlbum() FAILURE");
      });
    });
  },
  createNewAlbum: function(albumId, authToken) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('INSERT INTO albums (albumId, authToken) VALUES ("' + albumId + '", "' + authToken + '")', [], function(tx) {
        console.log("websql: createNewAlbum() success");
        console.log("websql: createNewAlbum() - Creating new album with albumId: " + albumId + " and authToken: " + authToken);
        that.currentAlbumId = albumId;
      }, function(tx) {
        console.log("websql: createNewAlbum() - Attempted to create a new album with albumId: " + albumId + " and authToken " + authToken);
        console.log("websql: createNewAlbum() FAILURE");
      });
    });
  },
  setAuthToken: function(authToken) {
    var that = this;
    if (that.currentAlbumId.length > 0) {
      that.db.transaction(function(tx) {
        tx.executeSql('UPDATE albums SET authToken = "' + authToken + '" WHERE albumId = "' + that.currentAlbumId + '"' , [], function(tx) {
          console.log("websql: setAuthToken() success");
        }, function(tx) {
          console.log("websql: setAuthToken() FAILURE");
        });
      });
    } else {
      console.error("websql: setAuthToken() - No currentAlbumId has been set.");
    }
  },
  getAuthToken: function(token) {
    var that = this;
    if (that.currentAlbumId.length > 0) {
      that.db.transaction(function(tx) {
        tx.executeSql('SELECT authToken FROM albums WHERE albumId = "' + that.currentAlbumId + '"', [], function(tx, results) {
          console.log("websql: getAuthToken() success");
          var authTokens = []
          for (var i = 0; i < results.rows.length; i++) {
            authTokens[i] = results.rows.item(i).authToken;
          }
          if (authTokens.length > 0) {
            console.log(authTokens);
            token = authTokens[0]; //There should only be one result
            console.log("websql: getAuthToken() - Found authToken " + token + " for albumId " + that.currentAlbumId);
          } else {
            console.error("websql: getAuthToken() - No authTokens were found!")
          }
        }, function(tx) {
          console.log("websql: getAuthToken() FAILURE");
        });
      });
    } else {
      console.error("websql: getAuthToken() - No currentAlbumId has been set.");
    }
  },
  setAlbumId: function(albumId) {
    var that = this;
    if (that.currentAlbumId.length > 0) {
      that.db.transaction(function(tx) {
        tx.executeSql('UPDATE albums SET albumId = "' + albumId + '" WHERE albumId = "' + that.currentAlbumId + '"', [], function(tx) {
          console.log("websql: setAlbumId() success");
        }, function(tx) {
          console.log("websql: setAlbumId() FAILURE");
        });
      });
    } else {
      console.error("websql: setAlbumId() - Cannot setAlbumId when the currentAlbumId has not been set!");
    }
  },
  getCurrentAlbumId: function() {
    var that = this;
    return that.currentAlbumId;
  }
}

$(document).ready(function() {
  websql.initialize();
});
