module.exports = function(app, redisClient) {

  app.get('/pubs.json', function(req, res) {
      redisClient.get('pubs', function(err, reply) {
        res.json(JSON.parse(reply));
      });
  });

};
