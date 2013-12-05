
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
var util = require('util');
var pubs = require('./data/pubs');
var admin = require('./controllers/admin');

if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var redisClient = require("redis").createClient(rtg.port, rtg.hostname);
	redisClient.auth(rtg.auth.split(":")[1]);
} else {
	var redisClient = require("redis").createClient();
}

//stash the pubs in Redis
redisClient.set('pubs', JSON.stringify(pubs));

// instantiate the express app.
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

// development only
if ('development' == app.get('env')) {
 app.use(express.errorHandler());
}


// routing
app.get('/', function(req, res) {
   res.render('index', { title: 'The 12 Pubs of Christmas', pubs: pubs, slug:'home',
        gmaps: googleMapsConfig.key});
});

require('./routes/pubs')(app,redisClient);
require('./routes/admin')(app, admin, redisClient, pubs);
require('./routes/map')(app, {pubs: pubs, gmaps: googleMapsConfig.key});
require('./routes/schedule')(app, {pubs: pubs});
require('./routes/foursquare')(app);
require('./routes/feed')(app,redisClient);

//api
var Api = require("./models/api");
api = new Api('foo');
api.TwitterFirstRun = true;
api.queryApis();
api.TwitterFirstRun = false;

//cronjob
var cronJob = require('cron').CronJob;

var cronJob = require('cron').CronJob;
new cronJob('*/10  * * * * *', function(){
    console.log('querying apis....');
    api.queryApis();
}, null, true, "America/Los_Angeles");


// Create server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
