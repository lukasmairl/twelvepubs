// /*
//  * API.
//  */
// var _ = require('underscore');
// var twitter = require('twit');
//var instagram = require('instagram-node-lib');

// var redis = require("redis");
// var client = redis.createClient();

// // Twitter
// var T = new twitter({
//     consumer_key: '4WLbGgPyRZ1RbCQ8J2i1kA'
//   , consumer_secret: 'bwXmWVXWhujAy4UXXEY1EiAf0BFfOBo3t0lF0sVo'
//   , access_token: '133161437-j28mPeyE886AtwQmA4BbJc7wsx348wlgdjOT90XM'
//   , access_token_secret: 'XU3lDMEDGkGVbptSTbpUxrXEtGuJNX0WPIfZ2JI7AhQ2w'
// });

// // Instagram
// instagram.set('client_id', '4e66c925fae5428dbe11a4f51c9ea7ce');
// instagram.set('client_secret', '3e0c84a3cb514a2ab9ca76f62cf1b1cd');

var foursquare = require('node-foursquare');

// Foursquare
var foursquareConfig = {
  'secrets' : {
    'clientId' : 'J00O10IPKZIZHTIKUS3NYZ3B1ODHTCIUU1OO2J1UNPVQXFPX',
    'clientSecret' : 'TR5T2G4H3TJ3K4UE2XLEQWGHH2RWRH0W3IEQ5MA1D4VHYHTE',
    'redirectUrl' : 'http://0.0.0.0:3000/callback'
  }
};

foursquare(foursquareConfig);

module.exports = function(app) {

  app.get('/api/foursquare/login', function(req, res) {
    res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
    res.end();
  });


  app.get('/api/foursquare/callback', function(req, res) {
    foursquare.getAccessToken({
      code: req.query.code
    },
    function(error, accessToken) {
      if (error) {
        res.send('An error was thrown: ' + error.message);
      }
      else {
        foursquare.Checkins.getRecentCheckins(null, accessToken,
              function(data) {
           console.log(data);
           res.render('index', {accessToken: accessToken, data: data});
        });
      }
    });
  });

//  app.get('/api/tweets', function(req, res) {
//    console.log("tweeeeeets");
//    T.get('search/tweets', { q: '#TwelvePubs', count: 100 },
//      function(err, res) {
//      console.log("---- data ----");
//      console.log(res);

//      var tweets = res.statuses;

//      _.each(tweets, function(tweet) {

//        var text    = tweet.text;
//        var createdAt   = tweet.created_at;
//        var user    = tweet.user;
//        var date = (new Date(tweet.created_at)).getTime() / 1000;

//        var tweet = {
//          text : text,
//          createdAt : date//,
//          //user: user
//        };


//        console.log("----------- TWEET --------------");
//        console.log(createdAt);
//        //console.log(JSON.stringify(tweet) );


//        var date = (new Date(createdAt)).getTime() / 1000;
//        var test = JSON.stringify(tweet);
//        console.log(date);
//        var args = [ 'dd', date, test ];
//        console.log(args);
//        client.zadd(args, function (err, response) {
//            if (err) throw err;
//            console.log('added '+response+' items.');
//        });

//      });

//      // -Infinity and +Infinity also work
//        var args1 = [ 'dd', '+inf', '-inf' ];
//        client.zrevrangebyscore(args1, function (err, response) {
//            if (err) throw err;
//            console.log('example1', response);
//            // write your code here
//        })
//    });
//  });

//  app.get('/api/instagrams', function(req, res) {
//    instagram.tags.recent({
//      q: 'zambrano',
//      complete: function(instagrams){

//      _.each(instagrams, function(instagram) {

//        var user    = instagram.user;
//        var createdAt   = instagram.created_time;
//        var image     = instagram.images.standard_resolution;

//        console.log("----------- INSTRAGRAM --------------");
//        console.log(createdAt);
//        console.log(user);
//        console.log(image);
//      });

//      }
//    });
//  });

};
