/*
 * FEED
 */
var redis = require('redis');
var client = redis.createClient();
var _ = require('underscore');

module.exports = function(app) {
  app.get('/feed', function(req, res) {

      //TODO: change to sort by timestamp
      var feed;
      var args = ['userfeed1', '+inf', '-inf'];
      client.zrevrangebyscore(args, function(err, response) {
          if (err) throw err;

          console.log("---- response -----");
          console.log(response.length);
        
        var activities = [];
        _.each(response, function(activity) {
      		
      		var a = JSON.parse(activity);

      		activities.push(a);

      		//console.log(a);
      		
      		if(a.type == "TWEET") {
      			console.log(a.text);
      		}


      		if(a.type == "INSTAGRAM") {
      			console.log(a.image.url);
      		}
      		
      	});

        //console.log('feed', response);
        res.render('feed', { title: 'Feed', feed: activities});

      });

      

      

      

  });
};
