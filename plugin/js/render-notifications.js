// render the notifications/actions
$(document).ready(function(){
    // retrieve the user id
    var userId = getUserId(document.cookie);

    // then get the notifications via an ajax call
    $.get('http://redpill.herokuapp.com/getnotifications', function(data) {
	
    });
});

var getUserId = function(docCookie) {
    // parse the docCookie and retrieve the user_id
    // and return the user_id
};



