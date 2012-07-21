var notifs = chrome.extension.getBackgroundPage().notifications;   
// loadIframeContents();

function updateUnreadCounter() {
   // notifications.fetchServerInfo(
        // TODO
   // );
}
 
// TODO check this..?
function loadIframeContents() {
    var iframe = document.getElementById('iframe');
    var form = document.getElementById('form');

    var mark_as_read = document.getElementById('mark_as_read');                

    var source = ''; // TODO
    form.setAttribute('action', source);

    iframe.onload = updateUnreadCounter;
    form.submit();
    return iframe;
}


