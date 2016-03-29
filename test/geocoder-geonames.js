
var should            = require('should'),
    GeocoderGeonames  = require('../lib/geocoder-geonames'),
    USERNAME          = 'luftlinie.org';

describe('GeocoderGeonames API Wrapper', function(){

  var geocoder;

  describe('Initializating', function() {

    it('without any arguments', function() {
      (function() {
        geocoder = new GeocoderGeonames();
      }).should.throw();
    });

    it('with additional arguments', function() {
      geocoder = new GeocoderGeonames({
        username: USERNAME
      }).should.not.throw();;

    });

  });


  describe('API responses', function() {

    beforeEach(function(done){
      geocoder = new GeocoderGeonames({
        username: USERNAME
      });
      done();
    });


    it('should be able to geocode', function(done) {
      geocoder.get('search',{
        q: 'Berlin'
      }).then(function(res) {
        res.should.be.json;
        done();
      });
    });


  });


  /*describe('Validations',function(){



  });*/

});
