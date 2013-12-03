
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// var instagram = require('instagram-node-lib');
// var foursquare = require('node-foursquare');
var gm = require('googlemaps');
var util = require('util');
var pubs = require('./data/pubs');
var admin = require('./controllers/admin');
var redis = require('redis');

var redisClient = redis.createClient();

redisClient.set('pubs', JSON.stringify(pubs));

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


var googleMapsConfig = {
  'key': 'AIzaSyCXKOd7viJVuC_fjYDWQfy57IZTLNzoEzE'
};

// Google maps
gm.config(googleMapsConfig);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// routing
app.get('/', function(req, res) {
   res.render('index', { title: 'The 12 Pubs of Christmas', pubs: pubs,
        gmaps: googleMapsConfig.key});
});

require('./routes/pubs')(app,redisClient);

require('./routes/admin')(app, admin, redisClient, pubs);

require('./routes/map')(app, {pubs: pubs, gmaps: googleMapsConfig.key});

//require('./routes/api')(app);

//feed
require('./routes/feed')(app);

// Create server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
