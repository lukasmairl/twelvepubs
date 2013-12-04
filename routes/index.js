/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'The Huge 12 Pubs of Christmas', pubs: pubs});
};
