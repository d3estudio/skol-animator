var LidarAnimation = require('../animations/lidar'),
    fs = require('fs'),
    Path = require('path'),
    helper = require('./shared');

var LidarHelper = function(where) {
    this.animation = new LidarAnimation(where);
    this.settings = null;
    this.readSettings();
    this.readings = [];
    this.enabled = false;
    return this;
}

LidarHelper.prototype = {
    setEnabled: function(status) {
        this.animation.setEnabled(status);
        this.enabled = status;
        this.downLevel = 0;
        this.readings = [];
        return this;
    },
    receiveValues: function(upward, downward) {
        helper.logger.debug(`LidarHelper: Received Values: ${upward}, ${downward}`);
        if(!this.enabled) {
            helper.logger.debug('LidarHelper: Disabled. Ignoring.');
            return;
        }
        this.readings.push(downward);
        if(this.readings.length < 2) {
            helper.logger.debug('LidarHelper: Not enough data. Ignoring.');
            return;
        }
        while(this.readings.length > 2) {
            helper.logger.debug('LidarHelper: Shifting');
            this.readings.shift();
        }
        helper.logger.debug(`LidarHelper: data: ${this.readings.join(', ')}`);
        var avg = this.readings.reduce((a, b) => a + b, 0) / this.readings.length;
        console.log(avg);
        if(avg <= 0.03) {
            helper.logger.debug('LidarHelper: Average is too low. Dropping.');
            this.animation.drop();
        }

        if(avg >= 0.10) {
            this.downLevel++;
            this.readings = [];
            helper.logger.debug('LidarHelper: downLevel increased to ' + this.downLevel);
            if(this.downLevel < 4) {
                this.animation.openLevel(this.downLevel);
            }
        }
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
