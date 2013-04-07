/*
 * The websql variable is already initialized for the entire document (see bottom of file).
 *
 * Usage:
 * ------
 * websql.createNewAlbum("foo", "bar");
 *
 * var result = []; // I strongly recommend instantiating a result array to store the return values of accessor functions.
 * websql.getUsername(result); // result: ["frou frou"]
 * 
 *
 * 
 */
var websql = {
  db: "",
  currentAlbumId: "",
  /*
   * The initialize() function must ALWAYS be called on the albums object. This is done for you be default.
   */
  initialize: function() {
    var that = this;
    that.db = openDatabase("elephoto", "1.0", "Elephoto meta information storage database.", 2 * 1024 * 1024);
    that.db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS albums (albumId unique, authToken)', [], function(tx) {
        console.log("websql: initialize() - successfully created 'albums' table");
      }, function(tx) {
        console.error("websql: initialize() - FAILED to create 'albums' table");
      });
    });
    that.db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS map (key unique, value)', [], function(tx) {
        console.log("websql: initialize() - successfully created 'map' table");
        that.db.transaction(function(tx) {
          tx.executeSql('INSERT INTO map (key, value) VALUES ("currentAlbumId", "")', [], function(tx) {
            console.log("websql: initialize() - successfully inserted currentAlbumId key/value pair with placeholder value");
          }, function(tx) {
            console.log("websql: initialize() - FALED to insert currentAlbumId key/value pair");
          });
          tx.executeSql('INSERT INTO map (key, value) VALUES ("username", "")', [], function(tx) {
            console.log("websql: initialize() - successfully inserted username key/value pair with placeholder value");
          }, function(tx) {
            console.log("websql: initialize() - FALED to insert username key/value pair");
          });
          tx.executeSql('INSERT INTO map (key, value) VALUES ("anonymousImageURL", "")', [], function(tx) {
            console.log("websql: initialize() - successfully inserted anonymousImageURL key/value pair with placeholder value");
          }, function(tx) {
            console.log("websql: initialize() - FALED to insert anonymousImageURL key/value pair");
          });
        });
      }, function(tx) {
        console.error("websql: initialize() - FAILED to create 'map' table");
      });
    });
  },
  /*
   * selectAlbum("foo");
   * ---------------------
   * Selects the current album. This has to be called every time the page reloads.
   * Other functions depend on the value of the currently selected album.
   */
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
            that.setCurrentAlbum(albumId);
            console.log("websql: selectAlbum() - Successfully selected a new album: " + that.currentAlbumId);
          } else {
            console.error("websql: selectAlbum() - There was no album found with albumId '" + albumId + "'");
          }
        } else {
          console.error("websql: selectAlbum() - There are no albums to select.");
        }
      }, function(tx) {
        console.error("websql: selectAlbum() FAILURE");
      });
    });
  },
  /*
   * createNewAlbum("foo", "bar");
   * -----------------------------
   * Creates a new album
   */
  createNewAlbum: function(albumId, authToken) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('INSERT INTO albums (albumId, authToken) VALUES ("' + albumId + '", "' + authToken + '")', [], function(tx) {
        console.log("websql: createNewAlbum() success");
        console.log("websql: createNewAlbum() - Creating new album with albumId: " + albumId + " and authToken: " + authToken);
        that.setCurrentAlbum(albumId);
      }, function(tx) {
        console.error("websql: createNewAlbum() - Attempted to create a new album with albumId: " + albumId + " and authToken " + authToken);
        console.error("websql: createNewAlbum() FAILURE");
      });
    });
  },
  /*
   * var result = [];
   * websql.getAlbums(result);
   * result; // => ["foo"]
   * -------------------------
   * Gets a list of all albums. You have to pass in an array object that will be populated with the info.
   * Thanks a lot Javascript callbacks, you suck.
   */
  getAlbums: function(albums) {
    var that = this;
    if (typeof(albums) !== "undefined" && typeof(albums) === "object") {
      that.db.transaction(function(tx) {
        tx.executeSql('SELECT albumId FROM albums', [], function(tx, results) {
          console.log("websql: getAlbums() success");
          for (var i = 0; i < results.rows.length; i++) {
            albums[i] = results.rows.item(i).albumId;
          }
        }, function(tx) {
          console.error("websql: getAlbums() FAILURE");
        });
      });
    } else {
      console.error("websql: you called getAlbums() without passing in a valid argument! getAlbums() requires an array.");
    }
  },
  /*
   * Set the authToken of the currently selected album.
   */
  setAuthToken: function(authToken) {
    var that = this;
    if (that.currentAlbumId.length > 0) {
      that.db.transaction(function(tx) {
        tx.executeSql('UPDATE albums SET authToken = "' + authToken + '" WHERE albumId = "' + that.currentAlbumId + '"' , [], function(tx) {
          console.log("websql: setAuthToken() success");
        }, function(tx) {
          console.error("websql: setAuthToken() FAILURE");
        });
      });
    } else {
      console.error("websql: setAuthToken() - No currentAlbumId has been set.");
    }
  },
  /*
   * var result = [];
   * websql.getAuthToken(result);
   * result; // => ["foo"]
   * -------------------------
   * Gets the authToken of the currently selected album. Like getAlbums(), you have to pass in
   * an array which will be populated with the value of the authToken. Unfortunately, you can't
   * pass in a String, because Javascript disallows pass-by-reference for primitive types.
   * DAMN IT BRENDAN EICH
   */
  getAuthToken: function(tokenArray) {
    var that = this;
    if (that.currentAlbumId.length > 0) {
      that.db.transaction(function(tx) {
        tx.executeSql('SELECT authToken FROM albums WHERE albumId = "' + that.currentAlbumId + '"', [], function(tx, results) {
          console.log("websql: getAuthToken() success");
          for (var i = 0; i < results.rows.length; i++) {
            tokenArray[i] = results.rows.item(i).authToken;
          }
          if (tokenArray.length > 0) {
            console.log("websql: getAuthToken() - Found authToken " + tokenArray[0] + " for albumId " + that.currentAlbumId);
          } else {
            console.error("websql: getAuthToken() - No authTokens were found!");
          }
        }, function(tx) {
          console.error("websql: getAuthToken() FAILURE");
        });
      });
    } else {
      console.error("websql: getAuthToken() - No currentAlbumId has been set.");
    }
  },
  /*
   * Sets the albumId of the currently selected album. Only use this if you want to change the ID of the current album!!!
   * Are you sure you wouldn't rather createNewAlbum() ???
   */
  setAlbumId: function(albumId) {
    var that = this;
    if (that.currentAlbumId.length > 0) {
      that.db.transaction(function(tx) {
        tx.executeSql('UPDATE albums SET albumId = "' + albumId + '" WHERE albumId = "' + that.currentAlbumId + '"', [], function(tx) {
          console.log("websql: setAlbumId() success");
        }, function(tx) {
          console.error("websql: setAlbumId() FAILURE");
        });
      });
    } else {
      console.error("websql: setAlbumId() - Cannot setAlbumId when the currentAlbumId has not been set!");
    }
  },
  /*
   * var result = [];
   * websql.getCurrentAlbum(result);
   * result; // => ["foo"]
   * -------------------------------
   * Gets the albumId of the currently selected album. You need to pass in an array.
   */
  getCurrentAlbum: function(albumArray) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('SELECT value FROM map WHERE key = "currentAlbumId"', [], function(tx, results) {
        console.log("websql: getCurrentAlbum() success");
        for (var i = 0; i < results.rows.length; i++) {
          albumArray[i] = results.rows.item(i).value;
        }
      }, function(tx) {
        console.error("websql: getCurrentAlbum() FAILURE");
      });
    });
  },
  /*
   * NEVER CALL THIS FUNCTION
   * You should call selectAlbum() instead
   */
  setCurrentAlbum: function(albumId) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('UPDATE map SET value = "' + albumId + '" WHERE key = "currentAlbumId"', [], function(tx) {
        console.log("websql: setCurrentAlbum() success");
        that.currentAlbumId = albumId;
      }, function(tx) {
        console.error("websql: setCurrentAlbum() FAILURE");
      });
    });
  },
  /*
  * var result = [];
  * websql.getUsername(result);
  * result; // => ["foo"]
  * ---------------------------
  */
  getUsername: function(usernameArray) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('SELECT value FROM map WHERE key = "username"', [], function(tx, results) {
        console.log("websql: getUsername() success");
        for (var i = 0; i < results.rows.length; i++) {
          usernameArray[i] = results.rows.item(i).value;
        }
      }, function(tx) {
        console.error("websql: getUsername() FAILURE");
      });
    });
  },
  setUsername: function(username) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('UPDATE map SET value = "' + username + '" WHERE key = "username"', [], function(tx) {
        console.log("websql: setUsername() success");
      }, function(tx) {
        console.error("websql: setUsername() FAILURE");
      });
    });
  },
  /*
  * var result = [];
  * websql.getAnonymousImageURL(result);
  * result; // => ["foo"]
  * ------------------------------------
  */
  getAnonymousImageURL: function(urlArray) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('SELECT value FROM map WHERE key = "anonymousImageURL"', [], function(tx, results) {
        console.log("websql: getAnonymousImageURL() success");
        for (var i = 0; i < results.rows.length; i++) {
          urlArray[i] = results.rows.item(i).value;
        }
      }, function(tx) {
        console.error("websql: getAnonymousImageURL() FAILURE");
      });
    });
  },
  setAnonymousImageURL: function(anonymousImageURL) {
    var that = this;
    that.db.transaction(function(tx) {
      tx.executeSql('UPDATE map SET value = "' + anonymousImageURL + '" WHERE key = "anonymousImageURL"', [], function(tx) {
        console.log("websql: setAnonymousImageURL() success");
      }, function(tx) {
        console.error("websql: setAnonymousImageURL() FAILURE");
      });
    });
  }
}

$(document).ready(function() {
  websql.initialize();
});
