
/**
 * Module dependencies.
 */

var express = require('express');
var winston = require('winston');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// var instagram = require('instagram-node-lib');
// var foursquare = require('node-foursquare');
var gm = require('googlemaps');
var util = require('util');
var pubs =  require('./data/pubs');
var admin = require('./controllers/admin');
var redis = require('redis');

var redisClient = redis.createClient();

redisClient.set("pubs", JSON.stringify(pubs))

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
}

// Google maps
gm.config(googleMapsConfig);


// // Foursquare
// var foursquareConfig = {
//   'secrets' : {
//     'clientId' : 'J00O10IPKZIZHTIKUS3NYZ3B1ODHTCIUU1OO2J1UNPVQXFPX',
//     'clientSecret' : 'TR5T2G4H3TJ3K4UE2XLEQWGHH2RWRH0W3IEQ5MA1D4VHYHTE',
//     'redirectUrl' : 'http://0.0.0.0:3000/callback'
//   }
// }

// foursquare(foursquareConfig);





// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// routing
app.get('/', function(req, res){
   res.render('index', { title: 'The 12 Pubs of Christmas', pubs: pubs, gmaps:googleMapsConfig.key});
});

// app.get('/login', function(req, res) {
//   res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
//   res.end();
// });

app.get('/admin', function(req, res){
    res.render('admin', {pubs: pubs});
})

app.post('/admin', function(req, res){
    admin.process(req, res, redisClient);
})

app.get('/pubs.json', function(req, res){
    redisClient.get("pubs", function(err, reply){
      res.json(JSON.parse(reply));
    });
})


// app.get('/callback', function (req, res) {
//   foursquare.getAccessToken({
//     code: req.query.code
//   },
//   function (error, accessToken) {
//    	if(error) {
//       res.send('An error was thrown: ' + error.message);
//     }
//     else {
//       foursquare.Checkins.getRecentCheckins(null, accessToken, function(data){
//          console.log(data);
//          res.render('index', {accessToken: accessToken, data:data});
//       });
//     }
//   });
// });

//fetch api data
//TODO cronjob
require("./routes/api")(app);

//feed
require("./routes/feed")(app);

//api
// var Api = require("./models/api");
// api = new Api();
// api.queryApis();



//console.log("-------------- CRON -----------------");
// var cronJob = require('cron').CronJob;

// var job = new cronJob('10 * * * * *', function(){
//     console.log("CRON");
//     // Runs every weekday (Monday through Friday)
//     // at 11:30:00 AM. It does not run on Saturday
//     // or Sunday.
//   }, function () {
//     // This function is executed when the job stops
//   },
//   true /* Start the job right now */
// );
// var cronJob = require('cron').CronJob;
// new cronJob('*/5  * * * * *', function(){
//     console.log('You will see this message every 5 seconds');
// }, null, true, "America/Los_Angeles");


// Create server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
