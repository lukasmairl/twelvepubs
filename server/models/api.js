//
//  Api
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

var Api = function() {};

Api.TwitterLastQuery;
Api.TwitterFirstRun;
Api.InstagramLastQuery;


Api.prototype.getTweets = function() {
  //console.log("------------------- get tweets -------------------");
  var self = this;

  T.get('search/tweets', { q: '#mmsakul12345_test', count: 2 }, function(err, res) {
      
      var tweets = res.statuses;

      var i = 0;
      console.log("tweet length", tweets.length);
      _.each(tweets, function(tweet) {

        var x = new Date(tweet.created_at);
        console.log("------------ TWEET -------");
        console.log(tweet.text);
        console.log(x);



        

        //Mon Dec 02 2013 21:29:11 GMT-0500 (EST) 
        //Mon Dec 02 2013 21:29:30 GMT-0500 (EST)
        
        
        console.log("----- tweet date ----");
        console.log(x,self.TwitterLastQuery);
    
        if( x > self.TwitterLastQuery ) {  
            console.log("---- INSIDE ----");  
            var text    = tweet.text;
            var createdAt   = tweet.created_at;
            var user    = tweet.user;
            var date = (new Date(tweet.created_at)).getTime() / 1000;

            var tweet = {
              type: "TWEET",
              text : text,
              createdAt : date,
              user: user.screen_name
            };

            self.addKey(tweet);

            i++;

            console.log(i);
            if(i == tweets.length ) {
                self.TwitterLastQuery = new Date();
            }
        }
        //}


      });
  });

}

Api.prototype.getInstagrams = function() {
    var self = this;
    
    instagram.tags.search({ 
        q: 'lukisfirst_4567',
        complete: function(instagrams) {

            var i = 0;
          _.each(instagrams, function(instagram) {

            var x = new Date(instagram.created_time);

            console.log(instagram.images.standard_resolution);

            if( x > self.InstagramLastQuery ) {  

                var user    = instagram.user;
                var createdAt   = instagram.created_time;
                var image     = instagram.images.standard_resolution;
                
                var instagram = {
                  type: "INSTAGRAM",
                  image: image,
                  createdAt: createdAt,
                  user: user.username
                };

                self.addKey(instagram);

                i++;

                if(i == tweets.length ) {
                    self.InstagramLastQuery = new Date();
                }
            }
      });
    }
  });
};

Api.prototype.addKey = function(key) {

    var args = [ 'userfeed5', key.createdAt, JSON.stringify(key) ];
    client.zadd(args, function (err, response) {
        if (err) throw err;
        console.log('added '+response+' items.');
    });

};

Api.prototype.queryApis = function() {
    
    if( this.TwitterFirstRun ) {
        console.log("----- FIRST TIME ------");
        this.TwitterLastQuery = new Date();
        this.InstagramLastQuery = new Date();
    }

    //var tweets = this.getTweets();
    var instagrams = this.getInstagrams();

    
}

module.exports = Api;
