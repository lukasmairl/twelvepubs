module.exports = function(app, admin, redisClient, pubs) {

  app.get('/admin', function(req, res) {
      res.render('admin', {pubs: pubs});
  });

  app.post('/admin', function(req, res) {
      admin.process(req, res, redisClient);
  });
};
