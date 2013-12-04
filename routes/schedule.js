/**
 * GET schedule
 */
module.exports = function(app, config) {

  app.get('/schedule', function(req, res) {
    res.render('schedule', { title: 'The 12 Pubs of Christmas', pubs: config.pubs});
  });

};
