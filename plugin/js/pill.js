(function () {
    pill = this;

    var server = "http://redpill.herokuapp.com/";
    
    pill.init = function() {
	window.onbeforeunload = function() {
	    pill.disconnect();
	};
	pill.connect();
    };

    pill.connect = function() {
	pill.socket = io.connect(server); 
	pill.socket.on('stalked', function(msg) {
	    console.log(msg); 
	    var data = JSON.parse(msg); 
	    notifications.newUnreadNotif(
		"/images/favicon.ico",
		data.name + "has just viewed" + (data.view_type)?"your profile":"this image of you",
		""
	    );
	});
	pill.socket.on('message', function(msg) {
	    console.log(msg); 
	});
	pill.socket.on('connect', function(msg) {
	    console.log("connected");
	});
	pill.socket.onclose = function () {
	    console.log("closed");	
	};
    };
    
    pill.disconnect = function(msg) {
	pill.send("close", msg);
	pill.socket.disconnect();
    };

    pill.send = function (e, msg) {
	pill.socket.emit(e, msg);
    };

    pill.init();
})();
