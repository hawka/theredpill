// render the notifications/actions
$(document).ready(function(){
    // retrieve the user id
    var userId = getUserId(document.cookie);

    // then get the notifications via an ajax call
    $.get('http://redpill.herokuapp.com/getnotifications', function(data) {
<<<<<<< HEAD
        data= JSON.parse(data);
        for (d in data){
           //information needed to retrieve from action: viewer_id, timestamp, link
           var stalker= data['viewer_id'];
           var time= data['timestamp'];
           var link= data['link'];
           var type= (data['view_type'] == 0) ? 'Photo': 'Profile';
           $.get('http://graph.facebook.com/'+ stalker, function(fb_data){
                fb_data= JSON.parse(fb_data);
                var real_name= fb_data["name"];
               
                var message= real_name + " looked at your <a href=" + link + ">" + type + "</a> at " + timestamp;
                $('body').append($('<div>']).html('<div>' + message + '</div>'));
               });

           
        }
=======
	// dat
>>>>>>> bb347a34f0fb03eb97b43f32ddfbbd02a8f78786
    });
});

var getUserId = function(docCookie) {
    // parse the docCookie and retrieve the user_id
    // and return the user_id
};



