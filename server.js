// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mail       = require('./app/model/mail');
var upload     = require('./app/model/upload');
var busboy     = require('connect-busboy');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to use busboy()
// For multipart if you're uploading files
app.use(busboy()); 

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here
// ----------------------------------------------------
// on routes that end in /mail
// ----------------------------------------------------
router.route('/mail')
	// Send mail (accessed at POST http://localhost:8080/api/mail)
	.post(function(req, res) {
		
		function mailCb(error, info){
                if(error){
                    console.log(error);
                    res.status(500).json(errors)
                }else{
					res.status(200).json(info)
                    console.log('Message sent: ' + info.messageId);
                }
            }

		mail.sendMail(req.body.type, req.body.email, req.body.code, req.body.first_name, req.body.last_name, req.body.organismo, req.body.dni, 
					req.body.sector, req.body.phone, req.body.consultation, req.body.filename, mailCb);
	});

// ----------------------------------------------------
// on routes that end in /upload
// ----------------------------------------------------
router.route('/upload')
	// Upload file (accessed at POST http://localhost:8080/api/upload)
    .post(function(req, res) {
    	upload.uploadFile(req, res, __dirname);
    });

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);