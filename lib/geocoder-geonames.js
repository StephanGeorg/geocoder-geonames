var request = require('request'),
          _ = require('lodash');

/**
 * node.js wrapper for the Geonames.org geocoder
 *
 * @param options Add username
 * @return Instance of {@link GeocoderGeonames}
 */
function GeocoderGeonames (options) {

  this.options  = options || {};
  this.endpoints   = {
    free:     'http://api.geonames.org/',
    secure:   'https://secure.geonames.net/',
    default:  'http://ws.geonames.net/',
  };
  this.services = ['astergdem','children','cities','contains','countryCode','countryInfo','countrySubdivision','earthquakes','extendedFindNearby','findNearby','findNearbyPlaceName','findNearbyPostalCodes','findNearbyStreets','findNearbyStreetsOSM','findNearByWeather','findNearbyWikipedia','findNearestAddress','findNearestIntersection','findNearestIntersectionOSM','findNearbyPOIsOSM','get','gtopo30','hierarchy','neighbourhood','neighbours','ocean','postalCodeCountryInfo','postalCodeLookup','postalCodeSearch','rssToGeo','search','siblings','srtm3','timezone','weather','weatherIcao','wikipediaBoundingBox','wikipediaSearch'];
  this.type = options.type || 'JSON';
  this.endpoint = this.options.endpoint || this.endpoints.free;

  if(this.options.premium || this.options.secure) {
    this.endpoint = this.endpoint || this.endpoints.secure;
  }

  if (!this.options.username) {
   throw new Error('Please provide a valid username!');
  }

}

module.exports = GeocoderGeonames;

/**
 *
 */
GeocoderGeonames.prototype.get = function (method,params) {
  params = params || {};

  return this.execute(this._getMethod(method),params);

};


/**
  *   Check service and method
  */
GeocoderGeonames.prototype._getMethod = function (method) {
  if(this.services.indexOf(method) !== -1) {
    return method;
  }
  return;

};

/**
  *   Parse the result from the services
  */
GeocoderGeonames.prototype._parseResult = function (result,method) {

  if(this.type === 'JSON') {
    result = JSON.parse(result);
    if(method === 'get') {
      result.formatted_name = this.formatted(result);
    }
    return result;
  } else {
    return result;
  }
};

/**
  *   Generate formatted_name String from get endpoint
  */
GeocoderGeonames.prototype.formatted = function (result) {

  // Generate formatted_address $ set name to Country
  var formatted_name = '',
      format = [];

  if(result.name === result.countryName || this.parseFcode(result.fcode)) {
    formatted_address = result.countryName;
  } else {
    if(result.name) {
      format.push(result.name);
    }
    if(result.adminName1) {
      format.push(result.adminName1);
    }
    if(result.countryName) {
      format.push(result.countryName);
    }
    formatted_name = format.join(', ');
  }

  return formatted_name;

};

GeocoderGeonames.prototype.parseFcode = function (fcode) {
  switch(fcode) {
    case 'PCLI'   : return 'ctry';
    case 'PCLF'   : return 'ctry';
    case 'PCLH'   : return 'ctry';
    case 'PCLS'   : return 'ctry';
    case 'PCLI'   : return 'ctry';
  }
};

/**
  * Sends a given request as a JSON object to the Geonames.org API and returns
  * a promise which if resolved will contain the resulting JSON object.
  *
  * @param  {[type]}   method     Geonames.org endpoint to call (http://www.geonames.org/export/ws-overview.html)
  * @param  {[type]}   params     Object containg parameters to call the API with
  * @param  {Function} Promise
  */
GeocoderGeonames.prototype.execute = function (method, query) {
  return new Promise(_.bind(function(resolve, reject) {

    var finalParams = _.extend({
      username: this.options.username
    }, query);

    var type = '';

    if(this.type === 'JSON') {
      type = this.type;
    }

    options = {
      url: this.endpoint + method + type,
      qs: finalParams
    };

    if(!method){
      reject({code: 404, msg: 'Wrong service!'});
    }

    request.get(options, _.bind(function(error, response, body) {
      if(error) {
        reject({code: 404, msg: error});
      } else {
        if(response.statusCode !== 200) {
          reject({code: response.statusCode, msg: 'Unable to connect to the API endpoint ' + options.url});
        } else if (response.body.error) {
          reject(response.body);
        }
        if(body){
          resolve(this._parseResult(response.body, method));
        } else {
          reject({code: response.statusCode, msg: 'Empty body'});
        }
      }
    },this));

  }, this));
};

/**
  *  Validations
  */
GeocoderGeonames.prototype.validateLngLat = function (lnglat) {
  var coordinates = lnglat.split(',');
  if(coordinates.length === 2) {
    var lat = Number(coordinates[1]),
        lng = Number(coordinates[0]);
    if((lng > -180 && lng < 180) && (lat > -90 && lat < 90)) {
      return true;
    }
  }
  return;
};
