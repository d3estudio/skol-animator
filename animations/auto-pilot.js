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
    //Music,
    //Idle
]

module.exports = function AutoPilot(where) {
    var _this = this;
    _this.name = 'AutoPilot';
    _this.status = false;
    _this.where = where;
    _this.animationCount = 0;

    _this.runAnimation = () => {
        var animation = ANIMATIONS[Math.round(Math.random()*1)];
        helper.logger.debug(`${_this.name} PREPARING TO RUN ${animation.name}`);
        if (animation.name == 'ScrollText') {
            animation = new animation('SKOL', 13, _this.where, false, false);
        } else if (animation.name == 'Ola') {
            animation = new animation(['little','full'][Math.round(Math.random()*1)], 13, _this.where, false);
        } else if (animation.name == 'MusicAnimation') {

        } else if (animation.name == 'IdleAnimation') {

        }
        helper.logger.debug(`${_this.name} WILL RUN ${animation.name}`);
        animation.init();
        animation.ended = (timeToWait) => {
            helper.logger.debug(`${_this.name} AUTO_PILOT ENDED ${animation.name}`);
            if (!timeToWait) {
                timeToWait = 25000;
            }
            helper.logger.debug(`${_this.name} WILL WAIT ${timeToWait} AND LOOP`);
            setTimeout(_this.pilot, timeToWait);
        }
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
