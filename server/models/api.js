//
//  Api
// 
//

var _ = require('underscore');
var twitter = require('twit');
var instagram = require('instagram-node-lib');
var foursquare = require('node-foursquare');
var redis = require("redis");
var client = redis.createClient();
  
// Twitter
var T = new twitter({
    consumer_key: '4WLbGgPyRZ1RbCQ8J2i1kA'
  , consumer_secret: 'bwXmWVXWhujAy4UXXEY1EiAf0BFfOBo3t0lF0sVo'
  , access_token: '133161437-j28mPeyE886AtwQmA4BbJc7wsx348wlgdjOT90XM'
  , access_token_secret: 'XU3lDMEDGkGVbptSTbpUxrXEtGuJNX0WPIfZ2JI7AhQ2w'
});

// Instagram
instagram.set('client_id', '4e66c925fae5428dbe11a4f51c9ea7ce');
instagram.set('client_secret', '3e0c84a3cb514a2ab9ca76f62cf1b1cd');

var Api = function() {}

Api.prototype.getTweets = function() {
  console.log("------------------- get tweets -------------------");
  var self = this;

  T.get('search/tweets', { q: '#TwelvePubs', count: 100 }, function(err, res) {
      console.log("---- data ----");
      console.log(res);

      var tweets = res.statuses;

      _.each(tweets, function(tweet) {
        
        var text    = tweet.text;
        var createdAt   = tweet.created_at;
        var user    = tweet.user;
        var date = (new Date(tweet.created_at)).getTime() / 1000;

        var tweet = {
          text : text,
          createdAt : date,
          user: user.screen_name
        };

        // console.log("----------- TWEET --------------");
        // console.log(tweet);

        self.addKey(tweet);

      });
  });

}

Api.prototype.getInstagrams = function() {
    var self = this;
    
    instagram.tags.recent({ 
        q: 'zambrano',
        complete: function(instagrams){
          _.each(instagrams, function(instagram) {

            var user    = instagram.user;
            var createdAt   = instagram.created_time;
            var image     = instagram.images.standard_resolution;
            
            var instagram = {
              image : image,
              createdAt : createdAt,
              user: user.username
            };

            self.addKey(instagram);

            // console.log("----------- INSTRAGRAM --------------");
            // console.log(createdAt);
            // console.log(user);
            // console.log(image);
      });
    }
  });
};

Api.prototype.addKey = function(key) {

    console.log("----- KEY -------");
    console.log(JSON.stringify(key));

    var args = [ 'userfeed', key.createdAt, JSON.stringify(key) ];
    client.zadd(args, function (err, response) {
        if (err) throw err;
        console.log('added '+response+' items.');
    });

};

Api.prototype.queryApis = function() {

  var tweets = this.getTweets();
  var instagrams = this.getInstagrams();

}

module.exports = Api;
