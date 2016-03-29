var GeocoderGeonames = require('geocoder-geonames'),
    _ = require('lodash');

var geonames = new GeocoderGeonames({});

geonames.get('Glogauer Straße 5, Kreuzberg, Berlin, Germany')
  .then(_.bind(function(response){
    console.log(response);
  }));
