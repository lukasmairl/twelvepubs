$(document).ready(function(){
    var maps = {};
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

      for (neighbourhood in pubs) {
        maps[neighbourhood] = new google.maps.Map(
            document.getElementById('map-canvas-' + neighbourhood),
        mapOptions[neighbourhood]);

        for (var i = 0; i < pubs[neighbourhood].length; i++) {
          var pub = pubs[neighbourhood][i];

          var pubLatLng =
              new google.maps.LatLng(pub.location[0], pub.location[1]);

          var image = {
            url: "./images/beer.png"
          };

          if (pub.active) {
             var marker = new google.maps.Marker({
              position: pubLatLng,
              title: pub.name,
              icon: image
            });
          } else {
            var marker = new google.maps.Marker({
              position: pubLatLng,
              title: pub.name
            });
          }
         

          marker.setMap(maps[neighbourhood]);
          console.log(pub);
          attachContent(maps[neighbourhood], marker, pub);
        }
      }

      $('.tabs').tabs({
        active: 0,
        activate: function(event, ui ) {

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
        content: "<div style='width:200px;'><p>" + pub.name + '/'+ pub.time + '</p></div>',
        maxWidth: 200
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });
    }
});
