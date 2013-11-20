
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var config = {
  'secrets' : {
    'clientId' : 'J00O10IPKZIZHTIKUS3NYZ3B1ODHTCIUU1OO2J1UNPVQXFPX',
    'clientSecret' : 'TR5T2G4H3TJ3K4UE2XLEQWGHH2RWRH0W3IEQ5MA1D4VHYHTE',
    'redirectUrl' : 'http://0.0.0.0:3000/callback'
  }
}

var foursquare = require('node-foursquare')(config);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

//foursquare
app.get('/login', function(req, res) {
  res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
  res.end();
});

app.get('/callback', function (req, res) {
  foursquare.getAccessToken({
    code: req.query.code
  }, 
  function (error, accessToken) {
   	if(error) {
      res.send('An error was thrown: ' + error.message);
    }
    else {
      res.render('index', {accessToken: accessToken});
    }
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
