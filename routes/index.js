var mongoose = require("mongoose")
, Schema = mongoose.Schema
, app = require("./app")
, io = require("socket.io").listen(app);

var url= require('url');
require("./models");

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
/**
 * storeInfo-
 * stores the information given from the url, and the userid
 */
exports.storeInfo= function(req,res){
   var userid; 
   var url;

   userid= req.body.userid;
   url= req.body.url;
   
   var action = parseURL(url,userid);
   if (action == null){
    action.save();
    res.json( {'code' :3});
   }
   else
   {
       res.json({'code': 2 });
   }
};

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
 
    var parsed= url.parse(url);
    action.link= url;
    //continues if the host is www.facebook.com
    if (parsed.host == 'www.facebook.com'){
        //if it's a photo
        if (parsed.pathname == '/photo.php'){
           // parse url for information
           var ids= parsed.query["set"].split['.'];
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
 * registerUser -
 * registers the user in our database
 */
exports.registerUser = function(req, res) {
    // use req.body for post, req.param for get
    var userid;

    // get the user's id
    userid = req.body.userid;
};

