// render the notifications/actions
$(document).ready(function(){
    // retrieve the user id
    chrome.cookies.get({url: "https://www.facebook.com", name: "c_user"}, function(cookie){ 
    // then get the notifications via an ajax call
        var userId= cookie.value;

        $.get('http://redpill.herokuapp.com/getnotifications?userid='+ userId+ '&count=0', function(data) {
            console.log(data);
            data= JSON.parse(data.actions);
            console.log(data);
            if (data.length == 0){
                $('body').append($('<div>').html('<div><br><b>No new notifications.</b><br>Maybe you should become more interesting. Or have creepier friends.<br>The truth hurts. </div>'));
            }
            else{
            for (d in data){
                //information needed to retrieve from action: viewer_id, timestamp, link
                console.log(data);
                var stalker= data['viewer_id'];
                var time= data['timestamp'];
                var link= data['link'];
                var type= (data['view_type'] == 0) ? 'Photo': 'Profile';
                var real_name= data["name"];
                if (data['seen'] == false){
                var message= real_name + " looked at your <a href=" + link + ">" + type + "</a> at " + time;
                $('body').append($('<div>').html('<div>' + message + '</div>'));
                }


        }}
    });
           
    
    }); 
}
);



