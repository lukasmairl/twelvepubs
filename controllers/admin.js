//api
var Api = require("../models/api");

exports.process = function(req, res, redisClient, pubs) {

  var api = new Api();
 
  redisClient.get('pubs', function(err, reply) {

    var selectedPub = req.body.pub;
    var hashtag;
    console.log("------");
    console.log(req.body);

    console.log(selectedPub);
    var pubs = JSON.parse(reply);

    for (neighbourhood in pubs) {
      for (var i = 0; i < pubs[neighbourhood].length; i++) {
        var pub = pubs[neighbourhood][i];
        pub.active = (pub.id == selectedPub) ? true : false;

        if(pub.id == selectedPub) {
          hashtag = pub.id;
        }
      }
    }

    var timestamp = (new Date()).getTime() / 1000;
    var item = {
      type: "NOTIFICATION",
      createdAt: timestamp,
      pub: selectedPub,
      hashtag: hashtag,
      checkinTime: new Date()
    };

    api.addKey(item);

    redisClient.set('pubs', JSON.stringify(pubs));

    res.render('admin', {pubs: pubs, selected: selectedPub,
        message: "you've just changed the bar to " + selectedPub});
  });

};
