var mongoose = require("mongoose")
, Schema = mongoose.Schema
, app = require("./app")
, io = require("socket.io").listen(app);

require("./models");

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.storeInfo= function(req,res){
    
};

/**
 * registerUser -
 * registers the user in our database
 */
exports.registerUser = function(req, res) {
    // use req.body for post, req.param for get
    var userid
    , response = {infos: [], errors: [], code: 400}
    , newUser;

    // get the user's id
    userid = req.body.userid;

    // create a new user and store in the database
    User.find({fbid: userid}, function(err, users){
	// if the user  already exists
	if (users.length > 0) {
	    response.errors.push("User Already Exists");
	    res.json(response);
	    return;
	}
	// if the doesn't exist yet, create the new user
	// by first performing a get request to the facebook
	// graph to get some more information about a user
	
	
	newUser = new User();
	newUser.fbid = userid;

	
    });
};


/** 
 * Define helper functions here
 * .getJSON
 */
var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function(options, onResult)
{
    console.log("rest::getJSON");

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};
