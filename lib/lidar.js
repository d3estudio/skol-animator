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
        if(this.enabled) {
            this.readSettings();
        }
        return this;
    },
    receiveValues: function(upward, downward) {
        this.debug(`LidarHelper: Received Values: ${upward}, ${downward}`);
        if(!this.enabled) {
            return;
        }
        this.readings.push(upward);
        while(this.readings.length > this.settings.readingsCount) {
            this.debug('LidarHelper: Shifting');
            this.readings.shift();
        }
        if(this.readings.length >= this.settings.readingsCount) {
            this.debug(`LidarHelper: data: ${this.readings.join(', ')}`);
            var avg = this.readings.reduce((a, b) => a + b, 0) / this.readings.length;
            if(avg <= this.settings.dropAvg) {
                this.debug('LidarHelper: Average is too low. Dropping.');
                this.animation.drop();
            }
        }

        if(upward > this.settings.nextLevelValue) {
            this.downLevel++;
            this.readings = [];
            this.debug('LidarHelper: downLevel increased to ' + this.downLevel);
            if(this.downLevel < 5) {
                this.animation.openLevel(this.downLevel);
            }
        }
    },
    forceLevelUp: function() {
        this.downLevel++;
        this.debug('LidarHelper: downLevel increased to ' + this.downLevel);
        if(this.downLevel < 5) {
            this.animation.openLevel(this.downLevel);
        }
    },
    forceDrop: function() {
        this.animation.drop();
    },
    readSettings: function() {
        try {
            var path = Path.resolve(__dirname, '../settings.json');
            this.settings = JSON.parse(fs.readFileSync(path)).LIDAR;
            this.debug('Loaded settings:');
            this.debug(`    readingsCount: ${this.settings.readingsCount}`);
            this.debug(`    dropAvg: ${this.settings.dropAvg}`);
            this.debug(`    nextLevelValue: ${this.settings.nextLevelValue}`);
            this.debug('----------------');
        } catch(ex) {
            this.error('LidarHelper: Error reading settings:');
            this.error(ex);
        }
    }
};

module.exports = LidarHelper;
