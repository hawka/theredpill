var notifs = chrome.extension.getBackgroundPage().notifications;   

notifs.markAllAsSeen( pill );

// loadIframeContents();

// TODO check this..?
function loadIframeContents() {
    var iframe = document.getElementById('iframe');

    var mark_as_read = document.getElementById('mark_as_read');                

    var source = ''; // TODO
    form.setAttribute('action', source);

    iframe.onload = updateUnreadCounter;
    form.submit();
    return iframe;
}


