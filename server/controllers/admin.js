

exports.process = function(req, res, redisClient){

  redisClient.get("pubs", function(err, reply){

    var selectedPub = req.body.pub;
    console.log(selectedPub);
    var pubs = JSON.parse(reply);

    for (neighbourhood in pubs) {
      for (var i = 0; i < pubs[neighbourhood].length; i++) {
        var pub = pubs[neighbourhood][i];
        pub.active = (pub.id == selectedPub) ?  true : false;
      }
    }

    redisClient.set("pubs", JSON.stringify(pubs));

    res.render('admin', {pubs: pubs, selected: selectedPub , message:"you've just changed the bar to " + selectedPub});
  });

}