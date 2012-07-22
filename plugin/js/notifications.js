notifications = {

    DEFAULT_TIMEOUT: 250, //ms

    // Collection of notifications currently on screen
    // format of contents is obj { viewer_name , view_type , link }
    // view_type: 0 is image, 1 is profile page
    notifs: [],
    // unread notification count
    num_unread_notif: 0,     

    initialize: function() {
        var self = notifications; 
        if (chrome && chrome.browserAction) {
            chrome.browserAction.setBadgeBackgroundColor({color : [255, 0, 0, 255]});
            self.updateUnreadNotifCount();
        }   
    },

    markAllAsSeen: function( pill ) {
        pill.send("markSeen", { _ids: [] });
    },

    getLastFiveNotifs: function( userid, iframe ) {
        var self = notifications; 
        if ( self.notifs.length == 5 )
            return self.notifs;

        $.get( 'http://redpill.herokuapp.com/getnotifications?count=5&userid=' + userid , function( response ) {
            var actions = JSON.parse(response);
            for ( var acn in actions ) {
                // switch type to string
                var vtype = '';
                if ( acn.view_type == 0 ) 
                    vtype = 'image';
                else if ( acn.view_type == 1 ) 
                    vtype = 'profile';
                else
                    vtype = 'information';

                self.notifs.push( { viewer: acn.viewer_name , type: vtype , link: acn.link } );
            }

            var iframeDoc = iframe.contentWindow.document;
            iframeDoc.open();
            var nstr = '';
            for ( var n in self.notifs ) 
                nstr += '<a href=\"' + n.link + '\">' + n.viewer + ' has looked at your ' + n.type + '.</a></br>';
            iframeDoc.write( nstr ); 
            iframeDoc.close();            

            iframe.src = iframe.src;
        }); 
    },

    // called when server sends us message that someone
    // has viewed something (new notif)
    newUnreadNotif: function( action ) {
        var self = notifications; 
        self.num_unread_notif++;
        self.updateUnreadNotifCount();
        // TODO html5 notification thing
        self.notifs.pop();
        self.notifs.unshift( action );
        self.getLastFiveNotifs();
    },

    // figures out and returns the number of unread notifs
    // the user has. called by updateUnreadNotifCount().
    getUnreadNotifCount: function() {
        var self = notifications; 
        return self.num_unread_notif;
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
