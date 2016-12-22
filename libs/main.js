  var map = L.map('map', {
      center: [18.9441970752, 72.8308646772],
      zoom: 14,
      minZoom: 5,
      maxZoom: 18
  });

  var layerMapboxLight = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaGFzdCIsImEiOiJjaXdwNGFtdzUwMDBsMm9wNzd3NGFtOThtIn0.lFgLx089BmfigTPq7sUVhA', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.light'
  });

  var layerOSM = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  });

  var layerMapSurfer = new L.tileLayer("http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}", {
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  var layerMapboxImagery = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/openstreetmap.map-inh7ifmo/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJhNVlHd29ZIn0.ti6wATGDWOmCnCYen-Ip7Q', {
      maxNativeZoom: 17,
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
  });

  var BingLayer = L.TileLayer.extend({
      getTileUrl: function(tilePoint) {
          this._adjustTilePoint(tilePoint);
          return L.Util.template(this._url, {
              s: this._getSubdomain(tilePoint),
              q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
          });
      },
      _quadKey: function(x, y, z) {
          var quadKey = [];
          for (var i = z; i > 0; i--) {
              var digit = '0';
              var mask = 1 << (i - 1);
              if ((x & mask) != 0) {
                  digit++;
              }
              if ((y & mask) != 0) {
                  digit++;
                  digit++;
              }
              quadKey.push(digit);
          }
          return quadKey.join('');
      }
  });

  var layerBingAerial = new BingLayer('https://t{s}.tiles.virtualearth.net/tiles/a{q}.jpeg?g=2732', {
      subdomains: ['0', '1', '2', '3', '4'],
      attribution: '&copy; <a href="http://bing.com/maps">Bing Maps</a>'
  });

  var bombay_1930 = new L.tileLayer('tiles/{z}/{x}/{y}.png', {
      tms: true,
      opacity: 1,
      zIndex: 1,
      maxNativeZoom: 16,
      maxZoom: 18,
      attribution: ""
  });

  var baseLayers = {
      "Mapbox Streets": layerMapboxLight,
      "OpenStreetMap": layerOSM,
      "MapSurfer": layerMapSurfer,
      "Mapbox Imagery": layerMapboxImagery,
      "Bing Aerial": layerBingAerial
  };

  var overlayLayers = {
      "Bombay 1930": bombay_1930
  };

  L.control.layers(baseLayers, overlayLayers, {
      collapsed: false
  }).addTo(map);

  layerMapboxLight.addTo(map);
  bombay_1930.addTo(map);



  var redMarker = L.AwesomeMarkers.icon({
      //icon: 'film',
      icon: 'video-camera',
      prefix: 'fa',
      markerColor: 'pink',
      popupAnchor: [0, -38]
  });



  var iconType = {
      "green": "film",
      "pink": "video-camera"
  };


  var pointLayer = L.geoJson(null, {
      pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {
              icon: L.AwesomeMarkers.icon({
                  icon: iconType[feature.properties.color],
                  prefix: 'fa',
                  markerColor: feature.properties.color,
                  popupAnchor: [0, -38]
              }),
              title: feature.properties.provided_name,
              riseOnHover: true
          });
      },
      onEachFeature: function(feature, layer) {
          if (feature.properties) {
              var content = '<b>' + feature.properties.provided_name + '</b>' +
                  '<br>' + feature.properties.description;
              layer.bindPopup(content);
          }
      }
  });
  $.getJSON("data/points.geojson", function(data) {
      pointLayer.addData(data);
      map.fitBounds(pointLayer);
  });

  map.addLayer(pointLayer);