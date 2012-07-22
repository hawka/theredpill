// the listening code
chrome.cookies.get( { url: "https://www.facebook.com" , name: "c_user" } , function(cookie) {

    var curr_uid = cookie.value;

    // listen for facebook things
    chrome.tabs.onSelectionChanged.addListener(onTabChange);
    chrome.tabs.onUpdated.addListener(onTabUpdate);

//    chrome.windows.onUpdated(function(w) {
//        chrome.tabs.getSelected(w.id,
//            function (response){
//                if ( response.url.indexOf(/.*facebook\.com.*/) != -1 ) {
//                    console.log ( "x" );
//                    pill.send( "storeInfo" , { userid: curr_uid , url: response.url } );                   
//                }
//            }
//        );
//    });
        
function onTabChange(tabID, selectInfo) {
    var curr_id = cookie.value;
    console.log("tab changed");
    chrome.tabs.get(tabID, function (tab) {
        if (tab.url.search(/.*facebook\.com.*/) != -1) {
            console.log(curr_id + " " + tab.url);
            pill.send("storeInfo", {userid: curr_uid, url: tab.url });
        }
    });
}

function onTabUpdate(tabID, changeInfo, tab) {
    var curr_id = cookie.value;
    console.log("tab updated");
    if (changeInfo.url) {
        if (changeInfo.url.search(/.*facebook\.com.*/) != -1) {
            console.log(curr_id + " " + tab.url);
            pill.send("storeInfo", {userid: curr_uid, url: changeInfo.url });
        }
    }
}

});

