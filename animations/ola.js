// main functions
var helper = require('../lib/shared');

module.exports = function Ola(type, width, where, loop) {
    var _this = this;
    _this.TIMERS = [];
    _this.name = 'OlaAnimation';
    _this.type = type;
    _this.width = parseInt(width);
    _this.currentCol = _this.width + 6;
    _this.currentColErase = _this.width + 6;
    _this.where = where;
    _this.running = false;
    _this.loop = loop;
    _this.timer = 5 * _this.where[0].motors[0].getFPS();
    _this.eraseWave = () => {
        if (_this.type == 'little') {
            if (_this.currentColErase > -30) {
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
                var TMP_TIMER = setTimeout(_this.eraseWave, _this.timer);
                _this.TIMERS.push(TMP_TIMER);
            } else {
                if (_this.loop) {
                    _this.currentCol = _this.width + 3;
                    _this.currentColErase = _this.width + 3;
                    var steps = 50;
                    var TMP_TIMER = setTimeout(_this.wave, _this.where[0].motors[0].getFPS() * steps);
                    _this.TIMERS.push(TMP_TIMER);
                } else {
                    _this.running = false;
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                    _this.ended(10000);
                }
            }
        } else {
            if (_this.currentColErase > -30) {
                _this.where[0].motors.forEach((motor) => {
                    var x = _this.currentColErase + _this.where[0].offset;
                    if (motor.x == (x - motor.y)) {
                        motor.sendCommand(0x14);
                    }
                });

                _this.where[3].motors.forEach((motor) => {
                    var y = ((_this.currentColErase - 16) * -1);
                    if (motor.y == y && motor.x > 4) {
                        motor.sendCommand(0x14);
                    }
                    if (_this.currentColErase < -11) {
                        if (motor.y == 28 + _this.currentColErase && motor.x < 5) {
                            motor.sendCommand(0x14);
                        }
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
                }
                _this.currentColErase--;
                var steps = 10; // 1 step is 9deg
                var TMP_TIMER = setTimeout(_this.eraseWave, _this.where[0].motors[0].getFPS() * steps);
                _this.TIMERS.push(TMP_TIMER);
            } else {
                if (_this.loop) {
                    _this.currentCol = _this.width + 3;
                    _this.currentColErase = _this.width + 3;
                    var steps = 900;
                    var TMP_TIMER = setTimeout(_this.wave(), _this.where[0].motors[0].getFPS() * steps);
                    _this.TIMERS.push(TMP_TIMER);
                } else {
                    _this.running = false;
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                    _this.ended(35000);
                }
            }
        }
    }
    _this.wave = () => {
        if (_this.type == 'little') {
            if (_this.currentCol > -30) {
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
                    helper.logger.debug(`${_this.name} WILL ERASE`);
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
                var TMP_TIMER = setTimeout(_this.wave, _this.timer);
                _this.TIMERS.push(TMP_TIMER);
            }
        } else {
            if (_this.currentCol > -30) {
                _this.where[0].motors.forEach((motor) => {
                    var x = _this.currentCol + _this.where[0].offset;
                    if (motor.x == (x - motor.y)) {
                        motor.sendCommand(0xE4);
                    }
                });

                _this.where[3].motors.forEach((motor) => {
                    var y = ((_this.currentCol - 16) * -1);
                    if (motor.x > 5) {
                        if (motor.y == y && _this.currentCol > 5) {
                            motor.sendCommand(0xE4);
                        }
                        if (_this.currentCol == 5) {
                            if (motor.y == 11) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == 4) {
                            if (motor.y == 12 && motor.x > 7) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == 3) {
                            if (motor.y == 12 && motor.x > 5 && motor.x < 8) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 13 && motor.x > 8) {
                                motor.sendCommand(0xE4);
                            }
                        }

                        if (_this.currentCol == 2) {
                            if (motor.y == 13 && motor.x > 6 && motor.x < 9) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 14 && motor.x > 8) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == 1) {
                            if (motor.y == 14 && motor.x == 8) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 15 && motor.x > 8) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == 0) {
                            if (motor.y == 16 && motor.x == 10) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -1) {
                            if (motor.y == 14 && motor.x == 7) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 15 && motor.x == 8) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 16 && motor.x == 9) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -2) {
                            if (motor.y == 13 && motor.x == 6) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 15 && motor.x == 7) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 16 && motor.x == 8) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -3) {
                            if (motor.y == 14 && motor.x == 6) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 16 && motor.x == 7) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -4) {
                            if ((motor.y == 15 || motor.y == 16) && motor.x == 6) {
                                motor.sendCommand(0xE4);
                            }
                        }
                    }
                    if (motor.x == 5) {
                        if (_this.currentCol == -5) {
                            if (motor.y > 10) {
                                motor.sendCommand(0xE4);
                            }
                        }
                    }
                    if (motor.x < 5) {
                        if (_this.currentCol == -7) {
                            if ((motor.y == 15 || motor.y == 16) && motor.x == 4) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -8) {
                            if (motor.y == 14 && motor.x == 4) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 16 && motor.x == 3) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -10) {
                            if (motor.y == 13 && motor.x == 4) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 15 && motor.x == 3) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 16 && motor.x == 2) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -11) {
                            if (motor.y == 14 && motor.x == 3) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 15 && motor.x == 2) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 16 && motor.x == 1) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -12) {
                            if (motor.y == 16 && motor.x == 0) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -13) {
                            if (motor.y == 14 && motor.x == 2) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 15 && motor.x < 2) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -14) {
                            if (motor.y == 13 && motor.x < 4 && motor.x > 1) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 14 && motor.x < 2) {
                                motor.sendCommand(0xE4);
                            }
                        }

                        if (_this.currentCol == -15) {
                            if (motor.y == 12 && motor.x < 5 && motor.x > 2) {
                                motor.sendCommand(0xE4);
                            }
                            if (motor.y == 13 && motor.x < 2) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -16) {
                            if (motor.y == 12 && motor.x < 3) {
                                motor.sendCommand(0xE4);
                            }
                        }
                        if (_this.currentCol == -17) {
                            if (motor.y == 11) {
                                motor.sendCommand(0xE4);
                            }
                        }
                    }



                    if (_this.currentCol < -17) {
                        if (motor.y == 28 + _this.currentCol && motor.x < 6) {
                            motor.sendCommand(0xE4);
                        }
                    }
                });


                if (_this.currentCol < 5) {
                    _this.where[1].motors.forEach((motor) => {
                        var x = _this.currentCol + _this.where[1].width + _this.where[1].offset;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0xE4);
                        }
                    });
                }
                if (_this.currentCol < -6) {
                    _this.where[2].motors.forEach((motor) => {
                        var x = _this.currentCol + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0xE4);
                        }
                    });
                }
                _this.currentCol--;
                var steps = 10; // 1 step is 9deg
                var TMP_TIMER = setTimeout(_this.wave, _this.where[0].motors[0].getFPS() * steps);
                _this.TIMERS.push(TMP_TIMER);
            }
        }
    }
    _this.init = () => {
        if (!_this.running) {
            _this.wave();
            helper.logger.debug(`${_this.name} STARTED`);
            _this.running = true;
            if (_this.type != 'little') {
                var steps = 900;
                var TMP_TIMER = setTimeout(() => {
                    helper.logger.debug(`${_this.name} WILL ERASE`);
                    _this.eraseWave();
                }, _this.where[0].motors[0].getFPS() * steps);
                _this.TIMERS.push(TMP_TIMER);
            }
        } else {
            helper.logger.debug(`${_this.name} already RUNNING`);
        }
    }
    _this.ended = (timeToWait) => {}
}
