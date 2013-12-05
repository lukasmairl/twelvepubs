$(document).ready(function() {
    var maps = {};
    var futurePubs = null;

    var re = /map-canvas-(\w+)/;
    var mapOptions = {
        dumbo: {
          zoom: 17,
          center: new google.maps.LatLng(40.702873, -73.986751)
        },
        les: {
          zoom: 16,
          center: new google.maps.LatLng(40.723017, -73.985778)
        }
    };


    $.get('/pubs.json').done(function(pubs) {

      var pub_num = 0; // running count of pub #s for map labels.

      for (neighbourhood in pubs) {
        maps[neighbourhood] = new google.maps.Map(
            document.getElementById('map-canvas-' + neighbourhood),
        mapOptions[neighbourhood]);

        for (var i = 0; i < pubs[neighbourhood].length; i++) {
          var pub = pubs[neighbourhood][i];
          var iconUrl;

          var pubLatLng =
              new google.maps.LatLng(pub.location[0], pub.location[1]);

          pub_num++;
          pub.pub_num = pub_num;

          if (pub.active){
            iconUrl = "./images/beer-now.png"
          } else if (futurePubs) {
            iconUrl= "./images/beer-to-do.png "
          } else {
            iconUrl = "./images/beer-done.png"
          }

          var image = {
            url: iconUrl
          };

           var marker = new google.maps.Marker({
            position: pubLatLng,
            title: pub.name,
            icon: image
          });

          marker.setMap(maps[neighbourhood]);

          attachContent(maps[neighbourhood], marker, pub);

          if (pub.active){
            futurePubs = true
          }

        }
      }

      $('.tabs').tabs({
        active: 0,
        activate: function(event, ui) {

          var neighourhoodID = ui.newPanel[0].id;
          var neighbourhood = neighourhoodID.replace(re, '$1');
          var center = mapOptions[neighbourhood].center;

          google.maps.event.trigger(maps[neighbourhood], 'resize');
          maps[neighbourhood].setCenter(center);
        }
      });
    });





    function attachContent(map, marker, pub) {
      var infoWindow = new google.maps.InfoWindow({
        content:  "<div class='map-label'><p><strong>Pub # " + pub.pub_num + ": </strong>" + pub.name + '</p>' + 
                  "<p><strong>Est. Arrival: </strong> "  + pub.time + '</p>' +
                  "<p> <a target='_blanks' href='http://maps.google.com/?q=" + pub.address + "'>" + pub.address + "</a></p>" +        
                  "</div>",
        maxWidth: 200
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });
    }
});
