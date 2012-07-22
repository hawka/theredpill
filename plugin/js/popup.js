var notifs = chrome.extension.getBackgroundPage().notifications;   

notifs.markAllAsSeen( pill );

chrome.cookies.get( { url: "https://www.facebook.com" , name: "c_user" } , function(cookie) {
    var curr_uid = cookie.value;
    var iframe = document.getElementById('iframe');
    notifs.getLastFiveNotifs( curr_uid , iframe );
}
