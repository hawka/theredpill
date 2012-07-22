// the listening code
chrome.cookies.get( { url: "https://www.facebook.com" , name: "c_user" } , function(cookie) {

    var curr_uid = cookie.value;

    // listen for facebook things
    chrome.windows.getCurrent(function(w) {
        chrome.tabs.getSelected(w.id,
            function (response){
                if ( response.url.search(/.*facebook\.com.*/) != -1 ) {
                    pill.send( "storeInfo" , { userid: curr_uid , url: response.url } );                   
                }
            }
        );
    });
        
});
