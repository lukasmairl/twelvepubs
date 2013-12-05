/*
 * Foursquare.
 */

 module.exports = function(app) {
	app.get('/foursquare/login', function(req, res) {
	  res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
	  res.end();
	});


	app.get('/foursquare/callback', function (req, res) {
	  foursquare.getAccessToken({
	    code: req.query.code
	  },
	  function (error, accessToken) {
	   	if(error) {
	      res.send('An error was thrown: ' + error.message);
	    }
	    else {
	      foursquare.Checkins.getRecentCheckins(null, accessToken, function(data){
	         console.log(data);
	         res.render('index', {accessToken: accessToken, data:data});
	      });
	    }
	  });
	});
};

