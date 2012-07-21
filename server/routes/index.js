
var mongoose = require("mongoose")
, Schema = mongoose.Schema
, app = require("./app")
, io = require("socket.io").listen(app);
, http = require("http");
, https = require("https");


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
    , response = {code:null}
    , newUser
    , options;

    // get the user's id
    userid = req.body.userid;

    // create a new user and store in the database
    User.find({fbid: userid}, function(err, users){
	// if the user  already exists
	if (users.length > 0) {
	    response.code = 0;
	    // 0 -> "User Already Exists"
	    res.json(response);
	    return;
	}
	// if the doesn't exist yet, create the new user
	// by first performing a get request to the facebook
	// graph to get some more information about a user
	options = {
	    host: "graph.facebook.com"
	    , port: 80
	    , path: "/"+userid
	};
	
	// get json received from open graph facebook
	/**
	   received JSON:
	   {
	   "id": "100000558164299",
	   "name": "Daniel Alabi",
	   "first_name": "Daniel",
	   "last_name": "Alabi",
	   "link": "http://www.facebook.com/alabidan",
	   "username": "alabidan",
	   "gender": "male",
	   "locale": "en_US"
	   }
	*/
	getJSON(options, function(statusCode, output){
	    console.log("statusCode: "+statusCode);
	    console.log("object received: "+JSON.stringify(output));
	    if (statusCode == 200) {
		// create and store a newUser
		newUser = new User();

		newUser.fbid = output.id;
		newUser.username = output.username;
		newUser.name = output.first_name + " " + output.last_name;
		
		// save the new user
		newUser.save();

		response.code = 1;
		// 1 -> "User successfully created"
		res.json(response);		
	    }  
	});	
    });
};


/** 
 * Define helper functions here
 * .getJSON
 */

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
var getJSON = exports.getJSON =  function(options, onResult)
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
