/**
 * GET home page.
 */
module.exports = function(app, config) {

  app.get('/map', function(req, res) {
    res.render('maps', { title: 'The 12 Pubs of Christmas', pubs: config.pubs,
        gmaps: config.gmaps});
  });

};
