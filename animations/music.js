// main functions
var helper = require('../lib/shared');

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
    _this.y = 16;
    _this.now = new Date().getTime();
    _this.type = Math.round(Math.random() * 2);
    _this.angle = Math.round(Math.random() * 1);
    _this.face = Math.round(Math.random() * 1);
    _this.ready = 0;

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
    _this.getRandomBass = (frequency) => {
        //this is where the animation should get place
        var amp = parseInt(frequency);
        if (amp > 0) {
            var command = 5;
            if (_this.angle == 1) {
                command = -5;
            }

            var face = 0x3c;
            if (_this.face == 1) {
                face = 0x28;
            }
            if (_this.type == 0) {
                _this.where.forEach((wall) => {
                    wall.motors.forEach((motor) => {
                        if (motor.x == _this.y) {
                            if (motor.command == face) {
                                motor.sendCommand(motor.command + command);
                            } else {
                                motor.sendCommand(face);
                            }
                        }
                    });
                });
                _this.y--;
                if (_this.y < 0) {
                    _this.y = 16;
                }
            } else if (_this.type == 1) {
                if (_this.y > -6) {
                    _this.where[0].motors.forEach((motor) => {
                        var x = _this.y + _this.where[0].offset;
                        if (motor.x == x) {
                            if (motor.command == face) {
                                motor.sendCommand(motor.command + command);
                            } else {
                                motor.sendCommand(face);
                            }
                        }
                    });
                    _this.where[3].motors.forEach((motor) => {
                        var y = ((-16 - (_this.y * -1)) * -1);
                        if (motor.y == y) {
                            if (motor.command == face) {
                                motor.sendCommand(motor.command + command);
                            } else {
                                motor.sendCommand(face);
                            }
                        }
                    });
                    _this.where[2].motors.forEach((motor) => {
                        var x = ((-16 - (_this.y * -1)) * -1);
                        if (motor.x == x) {
                            if (motor.command == face) {
                                motor.sendCommand(motor.command + command);
                            } else {
                                motor.sendCommand(face);
                            }
                        }
                    });
                    if (_this.y < 0) {
                        _this.where[1].motors.forEach((motor) => {
                            if (_this.y == -1) {
                                if (motor.x == 0 || motor.x == 10 || motor.y == 0) {
                                    if (motor.command == face) {
                                        motor.sendCommand(motor.command + command);
                                    } else {
                                        motor.sendCommand(face);
                                    }
                                }
                            }
                            if (_this.y == -2) {
                                if (motor.x == 1 || motor.x == 9 || motor.y == 1) {
                                    if (motor.command == face) {
                                        motor.sendCommand(motor.command + command);
                                    } else {
                                        motor.sendCommand(face);
                                    }
                                }
                            }
                            if (_this.y == -3) {
                                if (motor.x == 2 || motor.x == 8 || motor.y == 2) {
                                    if (motor.command == face) {
                                        motor.sendCommand(motor.command + command);
                                    } else {
                                        motor.sendCommand(face);
                                    }
                                }
                            }
                            if (_this.y == -4) {
                                if (motor.x == 3 || motor.x == 7 || motor.y == 3) {
                                    if (motor.command == face) {
                                        motor.sendCommand(motor.command + command);
                                    } else {
                                        motor.sendCommand(face);
                                    }
                                }
                            }
                            if (_this.y == -5) {
                                if (motor.x == 4 || motor.x == 6 || motor.y == 4) {
                                    if (motor.command == face) {
                                        motor.sendCommand(motor.command + command);
                                    } else {
                                        motor.sendCommand(face);
                                    }
                                }
                            }
                        });
                    }
                }
                _this.y--;
                if (_this.y < -5) {
                    _this.y = 16;
                }
            } else if (_this.type == 2) {
                var y = _this.y - 12;
                if (_this.y == 11) {
                    _this.where[3].motors.forEach((motor) => {
                        if (motor.command == face) {
                            motor.sendCommand(motor.command + command);
                        } else {
                            motor.sendCommand(face);
                        }
                    });
                } else {
                    [_this.where[0], _this.where[1], _this.where[2]].forEach((wall) => {
                        wall.motors.forEach((motor) => {
                            if (motor.y == y) {
                                if (motor.command == face) {
                                    motor.sendCommand(motor.command + command);
                                } else {
                                    motor.sendCommand(face);
                                }
                            }
                        });
                    })
                }
                _this.y--;
                if (_this.y < 11) {
                    _this.y = 16;
                }
            }
        }
    }
    _this.equalizer = (frequency) => {
        if (_this.ready == 0) {
            _this.ready = 1;
            var steps = 60;
            var face = 0x3c;
            if (_this.face == 1) {
                face = 0x28;
            }
            _this.where.reduce((a, b) => a.concat(b.motors), []).forEach(motor => motor.sendCommand(face));
            setTimeout(() => {
                _this.ready = 2;
            }, (_this.where[0].motors[0].getFPS() * steps));
        }
        if (_this.ready == 2) {
            var time = new Date().getTime();
            //if (time > now + 120000) {
            if (time > _this.now + 30000) {
                _this.now = time;
                _this.type = Math.round(Math.random() * 2);
                _this.angle = Math.round(Math.random() * 1);
                _this.face = Math.round(Math.random() * 1);
                _this.ready = 0;
            }
            _this.type = 2;
            _this.getRandomBass(frequency);
        }
    }
    _this.process = (data) => {
        _this.equalizer(data);
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
