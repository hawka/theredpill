(function () {
    pill = this;

    var server = "http://late-dawn-8160.herokuapp.com";
    
    pill.init = function() {
	window.onbeforeunload = function() {
	    pill.disconnect();
	};
    };

    pill.connect = function() {
	
    };
    
    pill.disconnect = function() {

    };

    pill.send = function (msg) {

    });
});
