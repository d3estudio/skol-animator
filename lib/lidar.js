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
    debug: function() {
        if(this.enabled) {
            helper.logger.debug.apply(helper.logger, arguments);
        }
    },
    error: function() {
        if(this.enabled) {
            helper.logger.error.apply(helper.logger, arguments);
        }
    },
    setEnabled: function(status) {
        this.animation.setEnabled(status);
        this.enabled = status;
        this.downLevel = 0;
        this.readings = [];
        return this;
    },
    receiveValues: function(upward, downward) {
        this.debug(`LidarHelper: Received Values: ${upward}, ${downward}`);
        if(!this.enabled) {
            this.debug('LidarHelper: Disabled. Ignoring.');
            return;
        }
        this.readings.push(upward);
        while(this.readings.length > 2) {
            this.debug('LidarHelper: Shifting');
            this.readings.shift();
        }
        if(this.readings.length >= 2) {
            this.debug(`LidarHelper: data: ${this.readings.join(', ')}`);
            var avg = this.readings.reduce((a, b) => a + b, 0) / this.readings.length;
            console.log(avg);
            if(avg <= 0.03) {
                this.debug('LidarHelper: Average is too low. Dropping.');
                this.animation.drop();
            }
        }

        if(upward > 0.03) {
            this.downLevel++;
            this.readings = [];
            this.debug('LidarHelper: downLevel increased to ' + this.downLevel);
            if(this.downLevel < 5) {
                this.animation.openLevel(this.downLevel);
            }
        }
    },
    readSettings: function() {
        try {
            var path = Path.resolve(__dirname, '../settings.json');
            this.settings = JSON.parse(fs.readFileSync(path));
        } catch(ex) {
            this.error('LidarHelper: Error reading settings:');
            this.error(ex);
        }
    }
};

module.exports = LidarHelper;
