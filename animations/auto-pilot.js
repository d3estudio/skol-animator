// main functions
var helper = require('../lib/shared');

// main animations
var ScrollText = require('../animations/scroll-text');
var Ola = require('../animations/ola');
var Music = require('../animations/music');
var Idle = require('../animations/idle');

var ANIMATIONS = [
    ScrollText,
    //Ola,
    //Music,
    //Idle
]

module.exports = function AutoPilot(where) {
    var _this = this;
    _this.name = 'AutoPilot';
    _this.status = false;
    _this.where = where;

    _this.runAnimation = () => {
        var animation = ANIMATIONS[Math.round(Math.random()*0)];
        helper.logger.debug(`${_this.name} PREPARING TO RUN ${animation.name}`);
        if (animation.name == 'ScrollTextAnimation') {
            animation = new animation('SKOL', 13, [rightWall, frontWall, leftWall, roof], false, false);
        } else if (animation.name == 'OlaAnimation') {

        } else if (animation.name == 'MusicAnimation') {

        } else if (animation.name == 'IdleAnimation') {

        }
        animation.init();
        animation.ended = (timeToWait) => {
            helper.logger.debug(`${_this.name} AUTO_PILOT ENDED ${animation.name}`);
            if (!timeToWait) {
                timeToWait = 10000;
            }
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
