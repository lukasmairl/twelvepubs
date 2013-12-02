/*
 * GET logout page.
 */

exports.logout = function(req, res) {
  res.render('logout', { title: 'Logged Out' });
};
