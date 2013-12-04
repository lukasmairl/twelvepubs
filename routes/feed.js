/*
 * FEED
 */
var _ = require('underscore');

module.exports = function(app, client) {
  app.get('/feed', function(req, res) {

      //TODO: change to sort by timestamp
      var args = ['userfeed5', '+inf', '-inf'];
      client.zrevrangebyscore(args, function(err, response) {
        if (err) throw err;

      var activities = [];
        _.each(response, function(activity) {
          var a = JSON.parse(activity);

          activities.push(a);
        });

        res.render('feed', { title: 'Feed', feed: activities});

      });
  });
};
