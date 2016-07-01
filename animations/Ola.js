// main functions
var helper = require('../lib/Shared');

module.exports = function Ola(type, width, where, loop) {
    var _this = this;
    _this.name = 'OlaAnimation';
    _this.type = type;
    _this.width = parseInt(width);
    _this.currentCol = _this.width + 3;
    _this.currentColErase = _this.width + 3;
    _this.where = where;
    _this.running = false;
    _this.loop = loop;
    _this.eraseWave = () => {
        if (_this.type == 'little') {
            if (_this.currentColErase > -37) {
                _this.where[0].motors.forEach((motor) => {
                    var x = _this.currentColErase + _this.where[0].offset;
                    if (motor.x == (x - motor.y)) {
                        motor.sendCommand(0x14);
                    }
                });
                if (_this.currentColErase < 5) {
                    _this.where[1].motors.forEach((motor) => {
                        var x = _this.currentColErase + _this.where[1].width + _this.where[1].offset;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0x14);
                        }
                    });
                }
                if (_this.currentColErase < -6) {
                    _this.where[2].motors.forEach((motor) => {
                        var x = _this.currentColErase + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0x14);
                        }
                    });
                    _this.where[3].motors.forEach((motor) => {
                        var y = 28 - (_this.currentColErase * -1);
                        if (motor.y == y) {
                            motor.sendCommand(0x14);
                        }
                    });
                }
                _this.currentColErase--;
                var steps = 5; // 1 step is 9deg
                setTimeout(_this.eraseWave, (_this.where[0].motors[0].getFPS() * steps) + 10);
            } else {
                if (_this.loop) {
                    _this.currentCol = _this.width + 3;
                    _this.currentColErase = _this.width + 3;
                    _this.wave();
                } else {
                    _this.running = false;
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                }
            }
        } else {
            if (_this.currentColErase > -37) {
                _this.where[0].motors.forEach((motor) => {
                    var x = _this.currentColErase + _this.where[0].offset;
                    if (motor.x == x) {
                        motor.sendCommand(0x14);
                    }
                });

                _this.where[3].motors.forEach((motor) => {
                    var y = ((_this.currentColErase - 16) * -1);
                    if (motor.y == y) {
                        motor.sendCommand(0x14);
                    }
                });

                if (_this.currentColErase < 5) {
                    _this.where[1].motors.forEach((motor) => {
                        var x = _this.currentColErase + _this.where[1].width + _this.where[1].offset;
                        if (motor.x == x) {
                            motor.sendCommand(0x14);
                        }
                    });
                }
                if (_this.currentColErase < -6) {
                    _this.where[2].motors.forEach((motor) => {
                        var x = _this.currentColErase + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == x) {
                            motor.sendCommand(0x14);
                        }
                    });
                }
                _this.currentColErase--;
                var steps = 5; // 1 step is 9deg
                setTimeout(_this.eraseWave, (_this.where[0].motors[0].getFPS() * steps) + 10);
            } else {
                if (_this.loop) {
                    _this.currentCol = _this.width + 3;
                    _this.currentColErase = _this.width + 3;
                    var steps = 1100;
                    setTimeout(_this.wave(), (_this.where[0].motors[0].getFPS() * steps) + 10);
                } else {
                    _this.running = false;
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                }
            }
        }
    }
    _this.wave = () => {
        if (_this.type == 'little') {
            if (_this.currentCol > -37) {
                _this.where[0].motors.forEach((motor) => {
                    var x = _this.currentCol + _this.where[0].offset;
                    if (motor.x == (x - motor.y)) {
                        motor.sendCommand(0x3C);
                    }
                });

                _this.where[3].motors.forEach((motor) => {
                    var y = ((_this.currentCol - 16) * -1);
                    if (motor.y == y) {
                        motor.sendCommand(0x3C);
                    }
                });

                if (_this.currentCol < 5) {
                    _this.where[1].motors.forEach((motor) => {
                        var x = _this.currentCol + _this.where[1].width + _this.where[1].offset;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0x3C);
                        }
                    });
                }
                if (_this.currentCol == -6) {
                    _this.eraseWave();
                }
                if (_this.currentCol < -6) {
                    _this.where[2].motors.forEach((motor) => {
                        var x = _this.currentCol + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0x3C);
                        }
                    });
                }
                _this.currentCol--;
                var steps = 5; // 1 step is 9deg
                setTimeout(_this.wave, (_this.where[0].motors[0].getFPS() * steps) + 10);
            }
        } else {
            if (_this.currentCol > -37) {
                _this.where[0].motors.forEach((motor) => {
                    var x = _this.currentCol + _this.where[0].offset;
                    if (motor.x == x) {
                        motor.sendCommand(0xE4);
                    }
                });

                _this.where[3].motors.forEach((motor) => {
                    var y = ((_this.currentCol - 16) * -1);
                    if (motor.y == y) {
                        motor.sendCommand(0xE4);
                    }
                });

                if (_this.currentCol < 5) {
                    _this.where[1].motors.forEach((motor) => {
                        var x = _this.currentCol + _this.where[1].width + _this.where[1].offset;
                        if (motor.x == x) {
                            motor.sendCommand(0xE4);
                        }
                    });
                }
                if (_this.currentCol < -6) {
                    _this.where[2].motors.forEach((motor) => {
                        var x = _this.currentCol + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == x) {
                            motor.sendCommand(0xE4);
                        }
                    });
                }
                _this.currentCol--;
                var steps = 10; // 1 step is 9deg
                setTimeout(_this.wave, (_this.where[0].motors[0].getFPS() * steps) + 10);
            }
        }
    }
    _this.init = () => {
        if (!_this.running) {
            _this.wave();
            helper.logger.debug(`${_this.name} STARTED`);
            var steps = 1100;
            _this.running = true;
            setTimeout(() => {
                _this.eraseWave();
            }, (_this.where[0].motors[0].getFPS() * steps) + 10);
        } else {
            helper.logger.debug(`${_this.name} already RUNNING`);
        }
    }
}
