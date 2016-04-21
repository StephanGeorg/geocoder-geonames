
var should            = require('should'),
    GeocoderGeonames  = require('../lib/geocoder-geonames'),
    USERNAME          = process.env.GEONAMES_USERNAME || null;

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
      }).should.not.throw();
    });

  });


  describe('API responses', function() {

    beforeEach(function(done){
      geocoder = new GeocoderGeonames({
        username: USERNAME
      });
      done();
    });


    it('service search with name "Berlin"', function(done) {
      geocoder.get('search',{
        q: 'Berlin',
        lang: 'ru'
      }).then(function(res) {
        res.should.be.json;
        done();
      });
    });

    it('service get with id "2825297"', function(done) {
      geocoder.get('get',{
        geonameId: 2825297,
        lang: 'zh'
      }).then(function(res) {
        res.should.be.json;
        done();
      });
    });


  });


});
