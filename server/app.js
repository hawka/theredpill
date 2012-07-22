
/**
 * Module dependencies.
 */

var express = require('express')
,  app = module.exports = express.createServer()
, routes = require('./routes')
, http = require('http');

var mongoose= require('mongoose');


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



// go to homepage where we show all notifications
// for the user
app.get('/', function(req, res){ res.render("/index.html"); });

// register a new user
app.post('/register', routes.registerUser);

// get the notifications for the user 
// since yesterday
app.get('/getnotifications', routes.getNotifications);


// open a port for this server

app.listen((process.env.PORT || 3000), function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


/*http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
*/
