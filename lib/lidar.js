var LidarAnimation = require('../animations/lidar'),
    fs = require('fs'),
    Path = require('path'),
    helper = require('./shared');

var LidarHelper = function(where) {
    this.animation = new LidarAnimation(where);
    this.settings = null;
    this.readSettings();
    return this;
}

LidarHelper.prototype = {
    setEnabled: function(status) {
        this.animation.setEnabled(status);
        return this;
    },
    receiveValues: function(upward, downward) {
        var levels = this.settings.LIDAR_LEVELS;
        this.animation.setLevel(upward);
    },
    readSettings: function() {
        try {
            var path = Path.resolve(__dirname, '../settings.json');
            this.settings = JSON.parse(fs.readFileSync(path));
        } catch(ex) {
            helper.logger.error('LidarHelper: Error reading settings:');
            helper.logger.error(ex);
        }
    }
};

module.exports = LidarHelper;
