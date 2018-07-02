  var map = L.map('map', {
      center: [18.9441970752, 72.8308646772],
      zoom: 14,
      minZoom: 5,
      maxZoom: 18
  });

  var layerMapboxLight = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaGFzdCIsImEiOiJjamozeHpsMjUxZW50M3ZudmNqOHJvam9tIn0.mxDriiso7mD7ru8WCkltSg', {
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


  var iconType = {
      "green": "film",
      "pink": "video-camera",
      "orange": "film"
  };


  var sidebar = L.control.sidebar('sidebar', {
      closeButton: true,
      position: 'left'
  });
  map.addControl(sidebar);

  map.on('click', function() {
      sidebar.hide();
  });




  var polyFeature = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "properties": {
              "name": "Girgaum"
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [72.81656742095947, 18.95144795356009],
                      [72.81753301620483, 18.95286856532121],
                      [72.81869173049927, 18.955324165697053],
                      [72.81957149505615, 18.957312972566765],
                      [72.82145977020264, 18.9568056261284],
                      [72.8232192993164, 18.956095338522307],
                      [72.82515048980713, 18.955648870479035],
                      [72.82575130462646, 18.95495887206185],
                      [72.82598733901978, 18.954207988188656],
                      [72.82658815383911, 18.95370063230706],
                      [72.8227686882019, 18.951772665886132],
                      [72.82010793685913, 18.950615875340294],
                      [72.8188633918762, 18.949296718439918],
                      [72.81656742095947, 18.95144795356009]
                  ]
              ]
          }
      }, {
          "type": "Feature",
          "properties": {
              "name": "Kamatipura"
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [72.82442092895508, 18.9617369681084],
                      [72.82508611679077, 18.96786542857161],
                      [72.82866954803467, 18.967053724896417],
                      [72.82873392105101, 18.966384066389146],
                      [72.82851934432983, 18.961696381526725],
                      [72.82442092895508, 18.9617369681084]
                  ]
              ]
          }
      }]
  };


  var polyLayer = L.geoJson(polyFeature, {
      style: function(feature) {
          return {
              color: "red",
              fill: true,
              opacity: 0.7,
              clickable: true
          };
      },
      onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.name);
      }
  }).addTo(map);



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
      }
  }).on('click', function(event) {

      var content = '<h2>' + event.layer.feature.properties.provided_name + '</h2>' +
          event.layer.feature.properties.description;

      sidebar.setContent(content);
      sidebar.show();
  });

  $.getJSON("data/points.geojson", function(data) {
      pointLayer.addData(data);
      map.fitBounds(pointLayer);
  });

  map.addLayer(pointLayer);
