var mongoose = require("mongoose")
, Schema = mongoose.Schema
, app = require("./../app")
, io = require("socket.io").listen(app)
, http = require("http")
, https = require("https");

io.configure(function(){
    io.set('log level', 1);
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 10);
});

require("./../models");

var node_url= require('url');
mongoose.connect("mongodb://heroku:c61b8669adeaf308cf2307bc63908ba7@flame.mongohq.com:27064/app6069460");

// import the models here
var User = mongoose.model("User")
, Action = mongoose.model("Action");
/*
 * GET home page.
 */

exports.index = function(req, res){
    // res.render('home.ejs');
    // res.json({"hi": "me"});
    res.render('index', {title: 'Red Pill'});
};


io.sockets.on('connection', function(socket){
    socket.on('storeInfo', function(data){
        console.log("HERE");
        console.log("store info data");
        console.log(data);
        var userid= data['userid']; 
        var url= data['url'];
	
        var action = parseURL(url,userid);
        if (action != null){
            action.save();
            User.find({userid: userid},function (err, doc){
                if (doc.length > 1){
                    console.log('multiple documents');
                    //res.json({'code': 0}); 
                }
                else{
                    var name= doc['name']; 
                    var jsonAction= {'viewer_id': action.viewer_id, 'viewed_id': action.viewed_id, 'view_type': action.view_type,
                        'timestamp': action.timestamp, 'link': action.link,'seen': action.seen, 'name': name };
                    socket.emit('stalked', jsonAction);
                    //res.json( {'code' :3});
                }

            });
            }
       else
	
   {
          //  res.json({'code': 2 });
            console.log("shit");
	}
	
    });
    
    /*
    socket.on('markSeen', function(data){
	console.log(data);
	data= JSON.parse(data);
	var _ids= data['_ids'];
	if (_ids[0] == null){
	    //mark all as seen
	    Action.find({}, function(err, actions){
		for (a in actions){
		    actions[a]['seen'] = true;
		    actions.save();
		}
		
	    });
	}
	Action.find({_id: _ids}, function(err, actions){
	    for (a in actions){
		actions[a]['seen'] = true;
		actions.save();
	    }
	});
    });
    */
    socket.on('markSeen', function(data) {
	Action.find({_id:data._ids}, function(err, toSeens) {
	    if (toSeens != undefined){
        toSeens.forEach(function(item, i) {
		item.seen = true;
		item.save();
	    });
        }
	});
    });
    
    socket.on('echo',function(data){
	socket.emit('echo', data);
    });
});



/** parses the URL for significant information 
 * https://www.facebook.com/photo.php?fbid=1831227463847&set=a.1266052214819.2031969.1335180786&type=1&theater
 * type = photo
 *
 * https://www.facebook.com/amahawk
 * type= profile : username is all that's given in the url
 * checks: not self
 *
 * RETURNS an Action() if it's not an action, returns null
 */          
function parseURL(url, userid){
    var action= new Action();
    action.viewer_id= userid;
 
    var parsed= node_url.parse(url);
    action.link= url;
    //continues if the host is www.facebook.com
    if (parsed.host == 'www.facebook.com'){
        //if it's a photo
        if (parsed.pathname == '/photo.php'){
           // parse url for information
           console.log("GETTING PHOTO");
           console.log(parsed.query);
           var ids= parsed.query['set'].split['.'];
           if (ids.length == 4){
            User.findOne({userid: ids[3]},function(err,docs){
                if (!err){
                if (docs != null){
                    //is a member
                    action.viewed_id= ids[3];
                }
                else {
                    console.log("viewer is not a member");
                    return null;
                    } 
            
                }
                else {console.log("Mongoose find error");}

            });
           }else
           {
           console.log("no information on the viewed");
           return null;
           }
           action.view_type= 0;  
        }
        //its not a photo
        else if (parsed.pathname != '/'){
        
        // check that it's a username
        // access mongoose to get that information and get userid
        var username= parsed.pathname.substring(1);
        var intrep= parseInt(username);
        var userid;
        action.view_type= 1;
        if (isNaN(intrep)){
            //its a string username
            User.findOne({username: username}, function (err, docs){
                if (!err){
                    if (docs != null){
                        //is a member
                        action.viewed_id= docs[userid];
                    }
                    else
                     {
                         console.log("null doc");
                         return null;
                     }
                }
                else {console.log("find one error");}
            });
        }
        else{
        User.findOne({userid: username}, function (err, docs){
            if (docs != null){
                action.viewed_id= userid;
            }
            else
            {return null; }
        });
        } 
        }
      else {return null;}

    }
    else
    {console.log("host is not facebook")
    return null;}
    return action;
}

/**
 * getNotifications
 * get the most recent notifications for a user
 * @get_param  count : count of the most recent facebook notifications
 * for a user
 * @get_param userid : facebook id of the user for which to get notifications
 * for
 *
 */
exports.getNotifications = function(req, res) {
    var count = req.query.count
    , userid = req.query.userid
    , currDate = new Date()
    , dayEarlier = (new Date()).setDate(currDate.getDate()-1);
    
    // first of all, delete the messages that might persist for the
    // user since yesterday
    console.log("hi!");
    Action.remove({viewed_id:userid, timestamp:{"$lt":dayEarlier}}, function(err){
	if (err) {
	    console.log("an error occured while trying to delete");
	} else {
	    console.log("successfully deleted stuff");
	    // after deleting those messages from the days before, keep on going:
	    options = {
		host: "graph.facebook.com"
		, port: 80
		, path: "/"+userid
	    };

	    getJSON(options, function(statusCode, output){
		console.log("statusCode: "+statusCode);
		console.log("object received: "+JSON.stringify(output));
		if (statusCode == 200) {
		    var fullName = output.name;
		    
		    // accumulate the notifications sorted in ascending order
		    Action.find({viewed_id:userid}).sort("timestamp",-1).execFind(function(err,actions){
			if (count) {
			    var actionsToSend = makePlainFromActions(actions.slice(0, count));
			    console.log("actions to send");
			    console.log(actionsToSend);			    
			    // send actions back to the user
			    res.json({name: fullName,actions:JSON.stringify(actionsToSend)});
			    
			} else {
			    // send actions back to the user
			    var actionsToSend = makePlainFromActions(actions);
			    console.log("actions to send");
			    console.log(actionsToSend);
			    // send actions back to the user
			    res.json({name: fullName,actions:JSON.stringify(actionsToSend)});
			}
		    });
		}
		
	    });
	}  
    });	    
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
    userid = req.query.userid;

    User.find({"userid": userid}, function(err, users){
	// if the user  already exists
	console.log(users);
	console.log(err);
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

		newUser.userid = output.id;
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

var makePlainFromActions = function(actions) {
    var actionsToSend = [], action;
    actions.forEach(function(item, i) {
	action = {
	    viewer_id : item.viewer_id
	    , viewed_id : item.viewed_id
	    , view_type: item.view_type
	    , timestamp : item.timestamp
	    , link : item.link
	    , seen : item.seen
	};			
	actionsToSend.push(action);
    });
    return actionsToSend;
};
    
