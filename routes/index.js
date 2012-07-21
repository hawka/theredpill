
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

    userid = req.body.userid;

};
