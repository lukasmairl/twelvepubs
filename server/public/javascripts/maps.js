$(document).ready(
  (function() {

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




    for (neighbourhood in pubs) {

      maps[neighbourhood] = new google.maps.Map(
          document.getElementById('map-canvas-' + neighbourhood),
      mapOptions[neighbourhood]);

      for (var i = 0; i < pubs[neighbourhood].length; i++) {
        var pub = pubs[neighbourhood][i];

        var pubLatLng =
            new google.maps.LatLng(pub.location[0], pub.location[1]);

        var marker = new google.maps.Marker({
            position: pubLatLng,
            title: pub.name,
            icon: "images/beer.png"
        });

        marker.setMap(maps[neighbourhood]);

        attachContent(maps[neighbourhood], marker, pub);
      }
    }


    $('.tabs').tabs(
      { active: 16,
        activate: function(event, ui ) {

          var neighourhoodID = ui.newPanel[0].id;
          var neighbourhood = neighourhoodID.replace(re, '$1');
          var center = mapOptions[neighbourhood].center;

          google.maps.event.trigger(maps[neighbourhood], 'resize');
          maps[neighbourhood].setCenter(center);
        }
      }

    );


    function attachContent (map, marker, pub){

      var infoWindow =  new google.maps.InfoWindow({
        content: "<p>"+pub.name+ "/"+ pub.time+"</p>"
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map,marker);
      });

    }


  })()
);
