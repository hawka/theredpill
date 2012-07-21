(function () {
    pill = this;

    var server = "http://late-dawn-8160.herokuapp.com/";
    
    pill.init = function() {
	window.onbeforeunload = function() {
	    pill.disconnect();
	};
	pill.connect();
    };

    pill.connect = function() {
	pill.socket = io.connect(server); 
	pill.socket.on('message', function(msg) {
	    console.log(msg); 
	});
	pill.socket.on('connect', function(msg) {

	});
	pill.socket.onclose = function () {
	
	};
    };
    
    pill.disconnect = function() {
	pill.send(JSON.stringify(
	pill.socket.disconnect();
    };

    pill.send = function (msg) {

    });
});
