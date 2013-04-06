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
    this.db = openDatabase("elephoto", "1.0", "Elephoto meta information storage database.", 2 * 1024 * 1024);
    this.db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS albums (albumId unique, authToken)', [], function(tx) {
        console.log("websql: initialize() success");
      }, function(tx) {
        console.log("websql: initialize() FAILURE");
      });
    });
  },
  getAlbums: function(albums) {
    if (typeof(albums) !== "undefined" && typeof(albums) === "object") {
      this.db.transaction(function(tx) {
        tx.executeSql('SELECT albumId FROM albums', [], function(tx, results) {
          console.log("websql: getAlbums() success");
          console.log(albums);
          for (var i = 0; i < results.rows.length; i++) {
            albums[i] = results.rows.item(i).albumId;
          }
          console.log(albums);
          return albums;
        }, function(tx) {
          console.log("websql: getAlbums() FAILURE");
        });
      });
    } else {
      console.error("websql: you called getAlbums() without passing in a valid argument! getAlbums() requires an array.");
    }
  },
  selectAlbum: function(albumId) {
    var albums = [];
    this.getAlbums(albums);
    if (albums.length > 0) {
      var albumFound = false;
      for (var i = 0; i < albums.length; i++) {
        if (albums[i] === albumId) {
          albumFound = true;
        }
      }
      if (albumFound) {
        this.currentAlbumId = albumId;
      } else {
        console.error("websql: There was no album found with albumId '" + albumId + "'");
      }
    } else {
      console.error("websql: There are no albums to select.");
    }
  },
  createNewAlbum: function(albumId, authToken) {
    this.db.transaction(function(tx) {
      tx.executeSql('INSERT INTO albums (albumId, authToken) VALUES ("' + albumId + '", "' + authToken + '")', [], function(tx) {
        console.log("websql: createNewAlbum() success");
        console.log("websql: Creating new album with albumId: " + albumId + " and authToken: " + authToken);
        this.currentAlbumId = albumId;
      }, function(tx) {
        console.log("websql: Attempted to create a new album with albumId: " + albumId + " and authToken " + authToken);
        console.log("websql: createNewAlbum() FAILURE");
      });
    });
  },
  setAuthToken: function(authToken) {
    if (this.currentAlbumId.length > 0) {
      this.db.transaction(function(tx) {
        tx.executeSql('UPDATE albums SET authToken = "' + authToken + '" WHERE albumId = "' + this.currentAlbumId + '"' , [], function(tx) {
          console.log("websql: setAuthToken() success");
        }, function(tx) {
          console.log("websql: setAuthToken() FAILURE");
        });
      });
    } else {
      console.error("websql: No currentAlbumId has been set.");
    }
  },
  getAuthToken: function() {
    if (this.currentAlbumId.length > 0) {
      this.db.transaction(function(tx) {
        tx.executeSql('SELECT authToken FROM albums WHERE albumId = "' + this.currentAlbumId + '"', [], function(tx) {
          console.log("websql: getAuthToken() success");
        }, function(tx) {
          console.log("websql: getAuthToken() FAILURE");
        });
      });
    } else {
      console.error("websql: No currentAlbumId has been set.");
    }
  },
  setAlbumId: function(albumId) {
    if (this.currentAlbumId.length > 0) {
      this.db.transaction(function(tx) {
        tx.executeSql('UPDATE albums SET albumId = "' + albumId + '" WHERE albumId = "' + this.currentAlbumId + '"', [], function(tx) {
          console.log("websql: setAlbumId() success");
        }, function(tx) {
          console.log("websql: setAlbumId() FAILURE");
        });
      });
    } else {
      console.error("websql: Cannot setAlbumId when the currentAlbumId has not been set!");
    }
  },
  getCurrentAlbumId: function() {
    return this.currentAlbumId;
  }
}

$(document).ready(function() {
  websql.initialize();
});
