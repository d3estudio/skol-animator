var NotificationsManager = function() {
    this.ready = false;
};

NotificationsManager.prototype = {
    setup: function() {
        if(!this.ready && Notification) {
            Notification.requestPermission().then(function(result) {
                console.log("[Notifications] Permission " + result);
            });
        } else if(!this.ready && !Notification) {
            console.warn("[Notifications] This browser does not support notifications.");
        }
        ready = true;
    },
    fire: function(title, body, icon) {
        var n = new Notification(title, { body: body, icon: icon });
    }
};

window.notifications = new NotificationsManager();
window.notifications.setup();
