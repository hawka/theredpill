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
    var userid;

    // get the user's id
    userid = req.body.userid;
};

