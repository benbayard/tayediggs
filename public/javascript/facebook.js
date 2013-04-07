function td_fb_post(msg, img_url, img_location) {
	// POST MSG, IMAGE URL AND LOCATION to wall
	// location is just appended as a string to the msg
	
	//var msg = 'TAYE DIGGS!';
	//var img_url = 'http://imgur.com/uw5KVt2.jpg';
	//var link_url = img_url; // required to have link to use img
	//var img_location = 'TayeDigg City';
	var link_url = img_url;
	msg += ' at ' + img_location;
	
	console.log(msg);
	console.log(img_url);
	console.log(link_url);
	console.log(location);
	FB.api('/me/feed', 'post', { 'message': msg, 'link': link_url, 'picture': img_url }, function(response) {
	  if (!response || response.error) { 
	    // alert('Error occured');
	  } else {
	    //alert('Post ID: ' + response.id);
			alert("Post successful");
	  }
	});
}
function td_fb_login() {
	var appId = "490499614339230";
	// var redirectPage = "http://www.google.com";
	// var permissions = "1";
	// var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=" + appId + "&response_type=code&redirect_uri=" + redirectPage + "&scope=" + permissions;
	// window.location = permissionUrl;
	FB.login(function(response) {
		if (response.authResponse) {
			// connected
			testAPI();
			console.log("connected");
		} else {
			// cancelled
			console.log("cancelled from inside login");
		}
	}, {scope:'publish_actions,publish_stream'});
}
function testAPI() {
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me', function(response) {
		console.log('Good to see you, ' + response.name + '.');
	});
}
window.fbAsyncInit = function() {
	FB.init({
		appId      : '490499614339230', // App ID
		channelUrl : '//tayediggs.herokuapp.com', // Channel File
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});

	// Additional init code here
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			// connected
			console.log("connected");
		} else if (response.status === 'not_authorized') {
			// not_authorized
			console.log("not authorized");
			td_fb_login();
		} else {
			// not_logged_in
			console.log("not logged in");
			td_fb_login();
		}
	});

};

// Load the SDK Asynchronously
(function(d){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
	}(document));

// for share button
$(window).load(function() {
  $("#fbshare").click(function() {
    console.log("fb share clicked");
    td_fb_login();

    var msg = "test msg";
    var img_url = "http://imgur.com/uw5KVt2.jpg";
    var img_location = "digcityz";
    td_fb_post(msg, img_url, img_location);
  });
});
