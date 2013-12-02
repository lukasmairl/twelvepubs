/*
 * FEED
 */
var redis = require('redis');
var client = redis.createClient();

module.exports = function(app) {
  app.get('/feed', function(req, res) {

      //TODO: change to sort by timestamp
      var args = ['userfeed', '+inf', '-inf'];
      client.zrevrangebyscore(args, function(err, response) {
          if (err) throw err;
          console.log('feed', response);
      });

  });
};
