notifications = {

    DEFAULT_TIMEOUT: 250, //ms

    // Collection of notifications currently on screen
    // format of contents is obj { viewer_name , view_type , link }
    // view_type: 0 is image, 1 is profile page
    notifs: [],
    // unread notification count
    num_unread_notif: 0,     

    initialize: function() {
        if (chrome && chrome.browserAction) {
            chrome.browserAction.setBadgeBackgroundColor({color : [255, 0, 0, 255]});
            updateUnreadNotifCount();
        }   
    },

    markAllAsSeen: function( pill ) {
        pill.send("markSeen", { _ids: [] });
    },

    getLastFiveNotifs: function( userid, iframe ) {
        if ( notifs.length == 5 )
            return notifs;

        $.get( 'http://redpill.herokuapp.com/getnotifications?count=5&userid=' + userid , function( response ) {
            var actions = JSON.parse(response);
            for ( var acn in actions ) {
                notifs.push( { viewer: acn.viewer_name , type: acn.view_type , link: acn.link } );
            }
            
        }); 
    },

    // called when server sends us message that someone
    // has viewed something (new notif)
    newUnreadNotif: function( action ) {
        num_unread_notif++;
        updateUnreadNotifCount();
        // TODO html5 notification thing
        notifs.pop();
        notifs.unshift( action );
    },

    // figures out and returns the number of unread notifs
    // the user has. called by updateUnreadNotifCount().
    getUnreadNotifCount: function() {
        return num_unread_notif;
    },

    // updates the little counter on the badge to how many
    // new notifications the user has (ie. people who have 
    // looked at his/her stuff since last time checked.)
    updateUnreadNotifCount: function() {
        if (chrome && chrome.browserAction) {
            // get how many unread notifications there are
            var self = notifications; // js/notifications.js
            chrome.browserAction.setBadgeText({text : ''});

            setTimeout(function() {
                   // ensures we don't show '0'
                    var num = (self.getUnreadNotifCount() || '') + ''; 
                    chrome.browserAction.setBadgeText({text : num});
                },
                self.DEFAULT_TIMEOUT, 
                false
            );
        }
    } 

};
