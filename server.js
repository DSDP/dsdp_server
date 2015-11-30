// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express      = require('express'); 		// call express
var app          = express(); 				// define our app using express
var existConfig  = require('./app/model/exist');
var analytics    = require('./app/model/analytics');
var proxy        = require('express-http-proxy');
var PeriodicTask = require('periodic-task');
var moment       = require('moment');
var google       = require('googleapis');
var https        = require("https");

//latest data
var analyticsMostVisited = {};


// add cross origin access
app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});

var port = process.env.PORT || 9090; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	next(); // make sure we go to the next routes and don't stop here
});

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------
//Proxy al /db/digesto del exist de desarrollo
app.use('/desa/exist/*', proxy(existConfig.urlExistDesa, {
    forwardPath: function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return existConfig.pathExist + req._parsedUrl.path.replace('/desa/exist','')
    }
}));

//Proxy al js de globales del exist de desarrollo
app.use('/desa/common/js/globals.js', proxy(existConfig.urlExistDesa, {
    forwardPath: function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return '/exist/rest/db' + req._parsedUrl.path.replace('/desa','')
    }
}));

//Proxy al /db/digesto del exist de produccion
app.use('/exist/*', proxy(existConfig.urlExistProd, {
    forwardPath: function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return existConfig.pathExist + req._parsedUrl.path.replace('/exist','')
    }
}));


app.use('/test/*', proxy(existConfig.urlExistProd, {
    forwardPath: function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return req._parsedUrl.path.replace('/test','');
    }
}));

//Proxy al js de globales del exist de produccion
app.use('/common/js/globals.js', proxy(existConfig.urlExistProd, {
    forwardPath: function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return '/exist/rest/db' + req._parsedUrl.path
    }
}));

app.use('/api/mostVisited', proxy(existConfig.urlExistProd, {
    forwardPath: function(req, res) {
        var concatenateLaws = function(laws){
          var out = '';
          for (i=0;i<laws.length;i++){
            out += 'ley=' + laws[i] + '&';
          }
          return out;
        };

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return existConfig.pathExist + existConfig.details + '?' + concatenateLaws(analyticsMostVisited);
    }
}));

// all of our routes will be prefixed with /api
//app.use('/api', router);

router.get('/mostVisited', function(req, res) {
  res.send(analyticsMostVisited);
});

//Refresca informacion de google analytics cada hora

var task = new PeriodicTask(moment.duration(30,'minutes'), function () {
  var jwtClient = new google.auth.JWT(
    analytics.serviceAccount,
    analytics.keyPath,
    null,
    analytics.scope);

  jwtClient.authorize(function(err, tokens) {
    if (err) {
      console.log(err);
      return;
    }

    var query = analytics.query + tokens.access_token;

    //llama a la api de analytics
    https.request(query, function(res){
      var body = '';

      res.on('data', function(chunk) {
          body += chunk;
      });

      res.on('end', function() {
          var response = JSON.parse(body);
          if (response.rows !== undefined){
            analyticsMostVisited = analytics.formatMostVisited(response.rows,existConfig);
          }
      });

    }).on('error', function(err) {
      console.log(err);
    }).end();

  });


});
task.run();

// START THE SERVER
// =============================================================================
app.listen(port);