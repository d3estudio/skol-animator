// main functions
var helper = require('../lib/shared');

// main animations
var ScrollText = require('../animations/scroll-text');
var Ola = require('../animations/ola');
var Music = require('../animations/music');
var Idle = require('../animations/idle');

var globalMusic = null;

var ANIMATIONS = [
    Music,
    ScrollText,
    Idle,
    Ola,
    Idle,
    Ola,
    Idle,
    Music,
    Idle,
    ScrollText,
    Idle,
    ScrollText,
    Idle,
    Music,
    ScrollText,
    Idle
]

module.exports = function AutoPilot(where, socket) {
    var _this = this;
    _this.name = 'AutoPilot';
    _this.status = false;
    _this.where = where;
    _this.animationCount = 0;
    _this.socket = socket;
    _this.TIMERS = [];
    _this.currentRunningAnimation = null;

    _this.runAnimation = () => {
        _this.currentRunningAnimation = ANIMATIONS[Math.round(Math.random() * 15)];
        helper.logger.debug(`${_this.name} PREPARING TO RUN ${_this.currentRunningAnimation.name}`);
        socket.emit('pilotstatus', `PREPARING TO RUN ${_this.currentRunningAnimation.name}`);
        if (_this.currentRunningAnimation.name == 'ScrollText') {
            _this.currentRunningAnimation = new _this.currentRunningAnimation('SKOL', 13, _this.where, false, false);
        } else if (_this.currentRunningAnimation.name == 'Ola') {
            var types = ['little', 'full'][Math.round(Math.random() * 1)];
            _this.currentRunningAnimation = new _this.currentRunningAnimation(types, 13, _this.where, false);
        } else if (_this.currentRunningAnimation.name == 'Music') {
            _this.currentRunningAnimation = new Music('equalizer', 13, _this.where, null);
            globalMusic = _this.currentRunningAnimation;
        } else if (_this.currentRunningAnimation.name == 'Idle') {
            var types = ['shuffle', 'live', 'open', 'breathing', 'spiral', 'reel', 'brendacadente'][Math.round(Math.random() * 6)];
            _this.currentRunningAnimation = new _this.currentRunningAnimation(types, 18, _this.where, false);
        }
        if (_this.currentRunningAnimation.type) {
            helper.logger.debug(`${_this.name} WILL RUN ${_this.currentRunningAnimation.name} OF TYPE ${_this.currentRunningAnimation.type}`);
            socket.emit('pilotstatus', `WILL RUN ${_this.currentRunningAnimation.name} OF TYPE ${_this.currentRunningAnimation.type}`);
        } else {
            helper.logger.debug(`${_this.name} WILL RUN ${_this.currentRunningAnimation.name}`);
            socket.emit('pilotstatus', `WILL RUN ${_this.currentRunningAnimation.name}`);
        }
        _this.currentRunningAnimation.ended = (timeToWait) => {
            helper.logger.debug(`${_this.name} AUTO_PILOT ENDED ${_this.currentRunningAnimation.name}`);
            socket.emit('pilotstatus', `ENDED ${_this.currentRunningAnimation.name}`);
            helper.logger.debug(`${_this.name} ERASED ${_this.currentRunningAnimation.name} FROM QUEUE`);
            socket.emit('pilotstatus', `ERASED ${_this.currentRunningAnimation.name}`);
            helper.clearTimers(_this.currentRunningAnimation);
            globalMusic = null;
            if (!timeToWait) {
                timeToWait = 25000;
            }
            helper.logger.debug(`${_this.name} WILL WAIT ${timeToWait} AND LOOP`);
            socket.emit('pilotstatus', `WILL WAIT ${timeToWait} AND LOOP`);
            if (_this.animationCount == 4) {
                var TIMER = setTimeout(() => {
                    helper.logger.debug(`${_this.name} PREPARE TO CALIBRATE`);
                    socket.emit('pilotstatus', `PREPARE TO CALIBRATE`);
                    _this.where.reduce((a, b) => a.concat(b.motors), []).forEach(motor => motor.sendCommand(0x1e));
                    var TIMER = setTimeout(() => {
                        helper.logger.debug(`${_this.name} WILL CALIBRATE`);
                        socket.emit('pilotstatus', `WILL CALIBRATE`);
                        _this.where.forEach((wall) => {
                            wall.motors.forEach((motor) => {
                                motor.sendCommand(0xFE);
                            })
                        });
                        var TIMER = setTimeout(() => {
                            _this.where.reduce((a, b) => a.concat(b.motors), []).forEach(motor => motor.sendCommand(0x14));
                            var TIMER = setTimeout(() => {
                                _this.animationCount = 0;
                                helper.logger.debug(`${_this.name} WILL LOOP`);
                                socket.emit('pilotstatus', `WILL LOOP`);
                                _this.pilot();
                            }, 25000);
                            _this.TIMERS.push(TIMER);
                        }, 2000);
                        _this.TIMERS.push(TIMER);
                    }, 5000);
                    _this.TIMERS.push(TIMER);
                }, timeToWait);
                _this.TIMERS.push(TIMER);
            } else {
                var TIMER = setTimeout(() => {
                    _this.animationCount++;
                    helper.logger.debug(`${_this.name} WILL ROTATE ALL MOTORS TO ZERO`);
                    socket.emit('pilotstatus', `WILL ROTATE ALL MOTORS TO ZERO`);
                    _this.where.reduce((a, b) => a.concat(b.motors), []).forEach(motor => motor.sendCommand(0x14));
                    var TIMER = setTimeout(() => {
                        _this.pilot();
                    }, 5000);
                }, timeToWait);
                _this.TIMERS.push(TIMER);
            }
        }
        if (!globalMusic) {
            _this.currentRunningAnimation.init();
            _this.informCurrentAnimation(_this.currentRunningAnimation);
        } else {
            var TIMER = setTimeout(() => {
                globalMusic = null;
                var TIMER = setTimeout(() => {
                    _this.currentRunningAnimation.ended(5000);
                }, 2000);
                _this.TIMERS.push(TIMER);
            }, 30000);
            _this.TIMERS.push(TIMER);
        }
    }
    _this.pilot = () => {
        if (_this.status) {
            _this.runAnimation();
        } else {
            _this.TIMERS.forEach((timer) => {
                clearTimeout(timer);
            });
            globalMusic = null;
            setTimeout(_this.pilot, 1000);
        }
    }
    _this.getBeatFromHell = (data) => {
        if (globalMusic) {
            globalMusic.process(data);
        }
    }
    _this.informCurrentAnimation = (animation) => {}
    _this.init = () => {
        _this.pilot();
    }
}
