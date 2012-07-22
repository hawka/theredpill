notifications = {

    DEFAULT_TIMEOUT: 250, //ms

    // Collection of notifications currently on screen
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

    getLastFiveNotifs: function() {
        // TODO
    },

    // called when server sends us message that someone
    // has viewed something (new notif)
    updateUnreadNotifCount: function() {
        num_unread_notif++;
        updateUnreadNotifCount();
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
