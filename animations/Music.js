// main functions
var helper = require('../lib/Shared');

module.exports = function Music(type, width, where) {
    var _this = this;
    _this.name = 'MusicAnimation';
    _this.type = type;
    _this.width = width;
    _this.currentCol = 0;
    _this.where = where;
    _this.running = false;
    _this.command = 0x1E;
    _this.maxPeak = 0;

    _this.boom = () => {
        if (_this.currentCol < 22) {
            if (_this.currentCol < 5) {
                _this.where[1].motors.forEach((motor) => {
                    if (_this.currentCol == 0) {
                        if (motor.x > 3 && motor.x < 7 && motor.y == 4) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        }
                    } else if (_this.currentCol == 1) {
                        if ((motor.x == 3 || motor.x == 7) && (motor.y == 3 || motor.y == 4)) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        } else if ((motor.x > 3 && motor.x < 7) && motor.y == 3) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        }
                    } else if (_this.currentCol == 2) {
                        if ((motor.x == 2 || motor.x == 8) && (motor.y == 2 || motor.y == 3 || motor.y == 4)) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        } else if ((motor.x > 2 && motor.x < 8) && motor.y == 2) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        }
                    } else if (_this.currentCol == 3) {
                        if ((motor.x == 1 || motor.x == 9) && (motor.y == 1 || motor.y == 2 || motor.y == 3 || motor.y == 4)) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        } else if ((motor.x > 1 && motor.x < 9) && motor.y == 1) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        }
                    } else if (_this.currentCol == 4) {
                        if ((motor.x == 0 || motor.x == 10) && (motor.y == 0 || motor.y == 1 || motor.y == 2 || motor.y == 3 || motor.y == 4)) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        } else if ((motor.x > 0 && motor.x < 10) && motor.y == 0) {
                            if (motor.command == 0x14) {
                                motor.sendCommand(_this.command);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        }
                    }
                });
            } else {
                _this.where[0].motors.forEach((motor) => {
                    var x = _this.currentCol - 5;
                    if (motor.x == x) {
                        if (motor.command == 0x14) {
                            motor.sendCommand(_this.command);
                        } else {
                            motor.sendCommand(0x14);
                        }
                    }
                });
                _this.where[2].motors.forEach((motor) => {
                    var x = (16 - (_this.currentCol - 5));
                    if (motor.x == x) {
                        if (motor.command == 0x14) {
                            motor.sendCommand(_this.command);
                        } else {
                            motor.sendCommand(0x14);
                        }
                    }
                });
                _this.where[3].motors.forEach((motor) => {
                    var y = (16 - (_this.currentCol - 5));
                    if (motor.y == y) {
                        if (motor.command == 0x14) {
                            motor.sendCommand(_this.command);
                        } else {
                            motor.sendCommand(0x14);
                        }
                    }
                });
            }
            _this.currentCol++;
            var steps = 5; // 1 step is 9deg
            setTimeout(_this.boom, (_this.where[0].motors[0].getFPS() * steps) + 10);
        } else {
            helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
        }
    }
    _this.bpm = (bpm) => {
        helper.logger.debug(`${bpm}`);
    }
    _this.equalizer = (frequency) => {
        [_this.where[0], _this.where[1], _this.where[2]].forEach((wall) => {
            wall.motors.forEach((motor) => {
                frequency.forEach((freq, index) => {
                    if (motor.x == (index + wall.offset)) {
                        var height = Math.floor(4 * freq / _this.maxPeak);
                        if (motor.y >= (4 - height)) {
                            if (!motor.locked) {
                                motor.sendCommand(0x19);
                            }
                        } else {
                            if (!motor.locked) {
                                motor.sendCommand(0x14);
                            }
                        }
                    }
                })
            });
        });
    }
    _this.process = (data) => {
        if (data instanceof Array) {
            var currentMax = _this.arrayMax(data);
            if (_this.maxPeak < currentMax) {
                _this.maxPeak = currentMax;
            }
            _this.equalizer(data);
        } else {
            _this.bpm(data);
        }
    }
    _this.arrayMax = (arr) => {
        var len = arr.length,
            max = -Infinity;
        while (len--) {
            if (arr[len] > max) {
                max = arr[len];
            }
        }
        return max;
    }
    _this.init = () => {
        if (!_this.running) {
            if (_this.type == 'very_fast_boom') {
                _this.command = 0x16;
                _this.boom();
            } else if (_this.type == 'fast_boom') {
                _this.command = 0x19;
                _this.boom();
            } else if (_this.type == 'boom') {
                _this.command = 0x1E;
                _this.boom();
            } else if (_this.type == 'long_boom') {
                _this.command = 0x28;
                _this.boom();
            }
            _this.running = true;
        } else {
            helper.logger.debug(`${_this.name} already RUNNING`);
        }
    }
}
