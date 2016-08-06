// main functions
var helper = require('../lib/shared');

// main animations
var ScrollText = require('../animations/scroll-text');
var Ola = require('../animations/ola');
var Music = require('../animations/music');
var Idle = require('../animations/idle');

var globalMusic = null;

var ANIMATIONS = [
    ScrollText,
    Ola,
    Music,
    Idle
]

module.exports = function AutoPilot(where) {
    var _this = this;
    _this.name = 'AutoPilot';
    _this.status = false;
    _this.where = where;
    _this.animationCount = 0;
    _this.noop = () => {};

    _this.runAnimation = () => {
        var animation = ANIMATIONS[Math.round(Math.random() * 3)];
        helper.logger.debug(`${_this.name} PREPARING TO RUN ${animation.name}`);
        if (animation.name == 'ScrollText') {
            animation = new animation('SKOL', 13, _this.where, false, false);
        } else if (animation.name == 'Ola') {
            var types = ['little', 'full'][Math.round(Math.random() * 1)];
            animation = new animation(types, 13, _this.where, false);
        } else if (animation.name == 'Music') {
            animation = new Music('equalizer', 13, _this.where, null);
            globalMusic = animation;
        } else if (animation.name == 'Idle') {
            var types = ['shuffle', 'live', 'open', 'breathing', 'spiral','reel','brendacadente'][Math.round(Math.random() * 6)];
            animation = new animation(types, 18, _this.where, false);
        }
        if (animation.type) {
            helper.logger.debug(`${_this.name} WILL RUN ${animation.name} OF TYPE ${animation.type}`);
        } else {
            helper.logger.debug(`${_this.name} WILL RUN ${animation.name}`);
        }
        animation.ended = (timeToWait) => {
            helper.logger.debug(`${_this.name} AUTO_PILOT ENDED ${animation.name}`);
            Object.keys(animation).forEach((key) => animation[key] = _this.noop);
            animation = null;
            globalMusic = null;
            helper.logger.debug(`${_this.name} ERASED ANIMATION FROM QUEUE`);
            if (!timeToWait) {
                timeToWait = 25000;
            }
            helper.logger.debug(`${_this.name} WILL WAIT ${timeToWait} AND LOOP`);
            if (_this.animationCount == 4) {
                setTimeout(() => {
                    helper.logger.debug(`${_this.name} PREPARE TO CALIBRATE`);
                    _this.where.reduce((a, b) => a.concat(b.motors), []).forEach(motor => motor.sendCommand(0x1e));
                    setTimeout(() => {
                        helper.logger.debug(`${_this.name} WILL CALIBRATE`);
                        _this.where.forEach((wall) => {
                            wall.motors.forEach((motor) => {
                                if (command == 0xFE && motor.x == 6 && motor.y == 3 && wall.name == 'right') {
                                    //do not calibrate
                                } else {
                                    motor.sendCommand(command);
                                }
                            })
                        });
                        setTimeout(() => {
                            _this.where.reduce((a, b) => a.concat(b.motors), []).forEach(motor => motor.sendCommand(0x14));
                            setTimeout(() => {
                                _this.animationCount = 0;
                                helper.logger.debug(`${_this.name} WILL LOOP`);
                                _this.pilot();
                            }, 25000)
                        }, 2000);
                    }, 5000);
                }, timeToWait);
            } else {
                _this.animationCount++;
                helper.logger.debug(`${_this.name} WILL ROTATE ALL MOTORS TO ZERO`);
                _this.where.reduce((a, b) => a.concat(b.motors), []).forEach(motor => motor.sendCommand(0x14));
                setTimeout(() => {
                    _this.pilot();
                }, 5000);
            }
        }
        if (!globalMusic) {
            animation.init();
        } else {
            setTimeout(() => {
                globalMusic = null;
                setTimeout(() => {
                    animation.ended(5000);
                }, 2000);
            }, 30000);
        }
    }
    _this.pilot = () => {
        if (_this.status) {
            _this.runAnimation();
        } else {
            setTimeout(_this.pilot, 1000);
        }
    }
    _this.getBeatFromHell = (data) => {
        if (globalMusic) {
            globalMusic.process(data);
        }
    }
    _this.init = () => {
        _this.pilot();
    }
}
