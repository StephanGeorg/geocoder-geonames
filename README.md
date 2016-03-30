# geocoder-geonames

A promises based node.js wrapper for the [Geonames.org](http://www.geonames.org/export/ws-overview.html) API.


## Installation

Installing using npm:

    npm i geocoder-geonames


## Usage ##

### Initialization ###
```javascript
var GeocoderGeonames = require('geocoder-geonames'),
    geocoder = new GeocoderGeonames({
      username:      'Your Geonames.org username',
    });
```

The constructor function also takes an optional configuration object:

* premium: true || false
* endpoint: specify

### Search ###
```javascript
  geocoder.get('search',{
    q: 'Berlin'
  })
  .then(function(response){
    console.log(response);
  })
  .catch(function(error){
    console.log(error);
  });
```

Optional parameters:
* you can pass all [request parameters](http://www.geonames.org/export/ws-overview.html)


### Response ###

All methods return a promise.
