//
//  Api
//
var _ = require('underscore');
var twitter = require('twit');
var instagram = require('instagram-node-lib');
var foursquare = require('node-foursquare');

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var client = require("redis").createClient(rtg.port, rtg.hostname);
  console.log(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  var client = require('redis').createClient();
}

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
  var self = this;

  T.get('search/tweets', { q: '#mmsakul12345_test', count: 40 }, function(err, res) {

      if (!res) return;

      var tweets = res.statuses;
      var i = 0;

      _.each(tweets, function(tweet) {

        var text    = tweet.text;
        var createdAt   = tweet.created_at;
        var user    = tweet.user;
        var date = (new Date(tweet.created_at)).getTime() / 1000;
        var tweetDate = new Date(tweet.created_at);

        if( tweetDate > self.TwitterLastQuery ) {  
            var text    = tweet.text;
            var createdAt   = tweet.created_at;
            var user    = tweet.user;
            var date = (new Date(tweet.created_at)).getTime() / 1000;

            var tweet = {
              type: "TWEET",
              id: tweet.id_str,
              text : text,
              createdAt : date,
              user: user.screen_name,
              tweet: tweet
            };

            //console.log(tweet);

            self.addKey(tweet);

            i++;

            if(i == tweets.length ) {
                self.TwitterLastQuery = new Date();
            }
        }
        
      });
  });

}

Api.prototype.getInstagrams = function() {
    var self = this;

    instagram.tags.recent({
        name: 'lukisfirst12345678',
        complete: function(instagrams){
          var data = instagrams;
          var i = 0;

          _.each(data, function(instagram) {
            var instaDate = new Date(instagram.created_time * 1000);

            if( instaDate > self.InstagramLastQuery ) {  
                var user    = instagram.user;
                var createdAt   = instagram.created_time;
                var image     = instagram.images.standard_resolution;
                var text = instagram.caption.text;


                //console.log(instagram);
                
                var inst = {
                  type: "INSTAGRAM",
                  image: image,
                  text: text,
                  createdAt: createdAt,
                  user: user.username,
                  instagram: instagram
                };

                self.addKey(inst);

                i++;

                if(i == instagrams.length ) {
                    self.InstagramLastQuery = new Date();
                }
            }
      });
    }
  });
};

Api.prototype.addKey = function(key) {

    var args = [ 'userfeed7', key.createdAt, JSON.stringify(key) ];
    client.zadd(args, function (err, response) {
        if (err) throw err;
        console.log('added '+response+' items.');
    });

};

Api.prototype.queryApis = function() {
    
    if( this.TwitterFirstRun ) {
        this.TwitterLastQuery = new Date();
        this.InstagramLastQuery = new Date();
    }

    var tweets = this.getTweets();
    var instagrams = this.getInstagrams();
   
}

module.exports = Api;
