// main functions
var helper = require('../lib/shared');

// main animations
var ScrollText = require('../animations/scroll-text');
var Ola = require('../animations/ola');
var Music = require('../animations/music');
var Idle = require('../animations/idle');

var ANIMATIONS = [
    ScrollText,
    Ola,
    Music,
    Idle
]

module.exports = function AutoPilot() {
    var _this = this;
    _this.name = 'AutoPilot';
    _this.status = false;

    _this.runAnimation = () => {
        var animation = ANIMATIONS[Math.round(Math.random()*3)];
        helper.logger.debug(`${_this.name} PREPARING TO RUN ${animation.name}`);
        setTimeout(_this.pilot, 1000);
    }
    _this.pilot = () => {

        if (_this.status) {
            _this.runAnimation();
        } else {
            helper.logger.debug(`${_this.name} WAITING`);
            setTimeout(_this.pilot, 1000);
        }
    }
    _this.init = () => {
        _this.pilot();
    }
}
