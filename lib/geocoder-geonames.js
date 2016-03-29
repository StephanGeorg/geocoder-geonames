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

  this.endpoint = this.options.endpoint || this.endpoints.free;

  if(this.options.premium || this.options.secure) {
    this.endpoint = this.endpoints.secure;
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
  *
  */
GeocoderGeonames.prototype._getMethod = function (method) {
  return method + 'JSON';
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

    options = {
      url: this.endpoint + method,
      qs: finalParams
    };

    request.get(options, function (error, response, body) {
      if(error) {
        reject({code: 404, msg: error});
      } else {
        if(response.statusCode !== 200) {
          reject({code: response.statusCode, msg: 'Unable to connect to the API endpoint ' + options.url});
        } else if (response.body.error) {
          reject(response.body);
        }
        if(body){
          resolve(JSON.parse(response.body));
        } else {
          reject({code: response.statusCode, msg: 'Empty body'});
        }
      }
    });

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
