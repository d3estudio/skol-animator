// main => s
var helper = require('../lib/shared');

module.exports = function Idle(type, width, where, loop) {
    var _this = this;
    var shuffle = (a) => {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }
    _this.name = 'IdleAnimation';
    _this.type = type;
    _this.where = where;
    _this.running = false;
    _this.loop = loop;
    _this.command = 0x3C;
    _this.currentCol = width;
    _this.currentColTopGlass = 16;
    _this.spiralTimer = 250;
    _this.spiralCounter = 0;

    _this.spiralXR = 5;
    _this.spiralYR = 2;
    _this.spiralXL = 28;
    _this.spiralYL = 2;

    _this.reset = () => {
        _this.right = shuffle(where[0].motors.slice(0));
        _this.front = shuffle(where[1].motors.slice(0));
        _this.left = shuffle(where[2].motors.slice(0));
        _this.roof = shuffle(where[3].motors.slice(0));
    }
    _this.idleGlass = () => {
        var flipDelay = 3;
        _this.where.forEach((wall) => {
            if (wall.name == 'top') {
                wall.motors.forEach((motor) => {
                    if (motor.y == _this.currentColTopGlass) {
                        setTimeout(() => {
                            motor.sendCommand(0x41);
                            setTimeout(() => {
                                motor.sendCommand(0x37);
                            }, _this.where[0].motors[0].getFPS() * flipDelay);
                        }, motor.x * 2 * 50);
                    }
                });
            } else {
                var offset= wall.offset;
                if (wall.name == 'left') {
                    offset -= 4;
                }
                wall.motors.forEach((motor) => {
                    if (motor.x == _this.currentCol + offset) {
                        setTimeout(() => {
                            motor.sendCommand(0x41);
                            setTimeout(() => {
                                motor.sendCommand(0x37);
                            }, _this.where[0].motors[0].getFPS() * flipDelay);
                        }, motor.y * 2 * 50);
                    }
                });
            }
        });
        _this.currentColTopGlass--;
        if (_this.currentColTopGlass < 0) {
            _this.currentColTopGlass = 16;
        }
        _this.currentCol++;
        if (_this.currentCol == 17) {
            _this.currentCol = 0;
        }
        var steps = 2;
        setTimeout(_this.idleGlass, (_this.where[0].motors[0].getFPS() * steps));
    }
    _this.idleBack = () => {
        if (_this.type == 'shuffle') {
            if ((_this.right.length + _this.front.length + _this.left.length + _this.roof.length) > 0) {
                if (_this.right[0] && !_this.right[0].locked) {
                    _this.right[0].sendCommand(_this.command);
                    _this.right.shift();
                }
                if (_this.front[0] && !_this.front[0].locked) {
                    _this.front[0].sendCommand(_this.command);
                    _this.front.shift();
                }
                if (_this.left[0] && !_this.left[0].locked) {
                    _this.left[0].sendCommand(_this.command);
                    _this.left.shift();
                }
                if (_this.roof[0] && !_this.roof[0].locked) {
                    _this.roof[0].sendCommand(_this.command);
                    _this.roof.shift();
                }
                if (_this.roof[0] && !_this.roof[0].locked) {
                    _this.roof[0].sendCommand(_this.command);
                    _this.roof.shift();
                }
                var steps = 2; // 1 step is 9deg
                setTimeout(_this.idleBack, _this.where[0].motors[0].getFPS() * steps);
            } else {
                if (_this.loop) {
                    _this.command = 0x3C;
                    _this.reset();
                    _this.idle();
                } else {
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                }
            }
        } else if (_this.type == 'open') {
            if (_this.currentCol > -6) {
                _this.where[0].motors.forEach((motor) => {
                    var x = _this.currentCol + _this.where[0].offset;
                    if (motor.x == x) {
                        motor.sendCommand(0x14);
                    }
                });
                _this.where[3].motors.forEach((motor) => {
                    var y = ((-16 - (_this.currentCol * -1)) * -1);
                    if (motor.y == y) {
                        motor.sendCommand(0x14);
                    }
                });
                _this.where[2].motors.forEach((motor) => {
                    var x = ((-16 - (_this.currentCol * -1)) * -1);
                    if (motor.x == x) {
                        motor.sendCommand(0x14);
                    }
                });
                if (_this.currentCol < 0) {
                    _this.where[1].motors.forEach((motor) => {
                        if (_this.currentCol == -1) {
                            if (motor.x == 0 || motor.x == 10 || motor.y == 0) {
                                motor.sendCommand(0x14);
                            }
                        }
                        if (_this.currentCol == -2) {
                            if (motor.x == 1 || motor.x == 9 || motor.y == 1) {
                                motor.sendCommand(0x14);
                            }
                        }
                        if (_this.currentCol == -3) {
                            if (motor.x == 2 || motor.x == 8 || motor.y == 2) {
                                motor.sendCommand(0x14);
                            }
                        }
                        if (_this.currentCol == -4) {
                            if (motor.x == 3 || motor.x == 7 || motor.y == 3) {
                                motor.sendCommand(0x14);
                            }
                        }
                        if (_this.currentCol == -5) {
                            if (motor.x == 4 || motor.x == 6 || motor.y == 4) {
                                motor.sendCommand(0x14);
                            }
                        }
                    });
                }
                _this.currentCol--;
                var steps = 10; // 1 step is 9deg
                setTimeout(_this.idleBack, (_this.where[0].motors[0].getFPS() * steps) + 10);
            } else {
                if (_this.loop) {
                    _this.currentCol = width;
                    var steps = 10; // 1 step is 9deg
                    setTimeout(_this.idle, (_this.where[0].motors[0].getFPS() * steps) + 10);
                } else {
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                }
            }
        } else if (_this.type == 'breathing') {
            if (_this.currentCol > -1) {
                _this.where.forEach((wall) => {
                    wall.motors.forEach((motor) => {
                        //start with top wall
                        var baseX = 5,
                            baseY = 11;
                        if (wall.name == 'front') {
                            baseX = 5;
                            baseY = 2;
                        } else if (wall.name == 'right') {
                            baseX = 5;
                            baseY = 2;
                        } else if (wall.name == 'left') {
                            baseX = 11;
                            baseY = 2;
                        }
                        if ((motor.x <= (baseX - _this.currentCol) || motor.x >= (baseX + _this.currentCol)) || (motor.y <= (baseY - _this.currentCol) || motor.y >= (baseY + _this.currentCol))) {
                            motor.sendCommand(0x14);
                        }
                    });
                });
                _this.currentCol--;
                var steps = 5; // 1 step is 9deg
                setTimeout(_this.idleBack, (_this.where[0].motors[0].getFPS() * steps) + 10);
            } else {
                if (_this.loop) {
                    _this.currentCol = 0;
                    var steps = 10; // 1 step is 9deg
                    setTimeout(_this.idle, (_this.where[0].motors[0].getFPS() * steps) + 2010);
                } else {
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                }
            }
        } else if (_this.type == 'spiral') {
            if (_this.spiralCounter > -1) {
                [_this.where[0], _this.where[1], _this.where[2]].forEach((wall) => {
                    if (wall.name == 'right' || wall.name == 'front') {
                        wall.motors.forEach((motor) => {
                            if (motor.x == _this.spiralXR && motor.y == _this.spiralYR) {
                                motor.sendCommand(0x14);
                            }
                            if (motor.x == (10 - _this.spiralXR) && motor.y == (4 - _this.spiralYR)) {
                                motor.sendCommand(0x14);
                            }
                            // if ((10 - _this.spiralXR) == 10 && motor.x > 10 && motor.y == (4 - _this.spiralYR)) {
                            //     motor.sendCommand(0x14);
                            // }
                        });
                    } else if (wall.name == 'left') {
                        wall.motors.forEach((motor) => {
                            if (motor.x == _this.spiralXL-17 && motor.y == _this.spiralYL) {
                                motor.sendCommand(0x14);
                            }
                            if (motor.x == (56 - _this.spiralXL-17) && motor.y == (4 - _this.spiralYL)) {
                                motor.sendCommand(0x14);
                            }
                            // if (_this.spiralXL == 23 && motor.x < 23 && motor.y == _this.spiralYL) {
                            //     motor.sendCommand(0x14);
                            // }
                        });
                    }
                });
                if (_this.spiralCounter > 24) {
                    _this.spiralYR++;
                    _this.spiralYL++;
                } else if (_this.spiralCounter > 15) {
                    _this.spiralXR++;
                    _this.spiralXL++;
                } else if (_this.spiralCounter > 12) {
                    _this.spiralYR--;
                    _this.spiralYL--;
                } else if (_this.spiralCounter > 5) {
                    _this.spiralXR--;
                    _this.spiralXL--;
                } else if (_this.spiralCounter > 4) {
                    _this.spiralYR++;
                    _this.spiralYL++;
                } else if (_this.spiralCounter > -1) {
                    _this.spiralXR++;
                    _this.spiralXL++;
                }
                _this.spiralCounter--;
                _this.spiralTimer = _this.spiralTimer * 1.1111111111111112;
                setTimeout(_this.idleBack, _this.spiralTimer);
            } else {
                if (_this.loop) {
                    _this.spiralCounter = 0;
                    _this.spiralTimer = 250;
                    _this.spiralXR = 5;
                    _this.spiralYR = 2;
                    _this.spiralXL = 28;
                    _this.spiralYL = 2;
                    setTimeout(_this.idle, 2000);
                } else {
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                }
            }
        }
    }
    _this.idleTest = () => {
        _this.where.forEach((wall, wallIndex) => {
            wall.motors.forEach((motor, motorIndex) => {
                motor.sendCommand(0x14);
            });
        });
        if (_this.loop) {
            var steps = 50;
            setTimeout(_this.idle, (_this.where[0].motors[0].getFPS() * steps));
        } else {
            helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
        }
    }
    _this.idle = () => {
        if (_this.type == 'shuffle') {
            if ((_this.right.length + _this.front.length + _this.left.length + _this.roof.length) > 0) {
                if (_this.right[0] && !_this.right[0].locked) {
                    _this.right[0].sendCommand(0x3C);
                    _this.right.shift();
                }
                if (_this.front[0] && !_this.front[0].locked) {
                    _this.front[0].sendCommand(0x3C);
                    _this.front.shift();
                }
                if (_this.left[0] && !_this.left[0].locked) {
                    _this.left[0].sendCommand(0x3C);
                    _this.left.shift();
                }
                if (_this.roof[0] && !_this.roof[0].locked) {
                    _this.roof[0].sendCommand(0x3C);
                    _this.roof.shift();
                }
                if (_this.roof[0] && !_this.roof[0].locked) {
                    _this.roof[0].sendCommand(0x3C);
                    _this.roof.shift();
                }
                var steps = 2; // 1 step is 9deg
                setTimeout(_this.idle, _this.where[0].motors[0].getFPS() * steps);
            } else {
                _this.command = 0x14;
                _this.reset();
                _this.idleBack();
            }
        } else if (_this.type == 'open') {
            _this.where.forEach((wall) => {
                wall.motors.forEach((motor) => {
                    motor.sendCommand(0x1E);
                });
            });
            var steps = 10; // 1 step is 9deg
            setTimeout(_this.idleBack, (_this.where[0].motors[0].getFPS() * steps) + 10);
        } else if (_this.type == 'breathing') {
            if (_this.currentCol < 12) {
                _this.where.forEach((wall) => {
                    wall.motors.forEach((motor) => {
                        //start with top wall
                        var baseX = 5,
                            baseY = 11;
                        if (wall.name == 'front') {
                            baseX = 5;
                            baseY = 2;
                        } else if (wall.name == 'right') {
                            baseX = 5;
                            baseY = 2;
                        } else if (wall.name == 'left') {
                            baseX = 11;
                            baseY = 2;
                        }
                        if (motor.x >= (baseX - _this.currentCol) && motor.x <= (baseX + _this.currentCol) && motor.y >= (baseY - _this.currentCol) && motor.y <= (baseY + _this.currentCol)) {
                            motor.sendCommand(0x19);
                        }
                    });
                });
                _this.currentCol++;
                var steps = 5; // 1 step is 9deg
                setTimeout(_this.idle, (_this.where[0].motors[0].getFPS() * steps) + 10);
            } else {
                var steps = 2; // 1 step is 9deg - 1000 is a delay
                setTimeout(_this.idleBack, (_this.where[0].motors[0].getFPS() * steps));
            }
        } else if (_this.type == 'live') {
            //[0x19, 0x16]
            if ((_this.right.length + _this.front.length + _this.left.length + _this.roof.length) > 0) {
                var command = [0x19];
                if (_this.right[0] && !_this.right[0].locked) {
                    _this.right[0].sendCommand(command[Math.floor(Math.random() * command.length)]);
                    var motor_right = _this.right[0];
                    _this.right.shift();
                    setTimeout(() => {
                        motor_right.sendCommand(0x14);
                    }, _this.where[0].motors[0].getFPS() + 1000);
                }
                if (_this.front[0] && !_this.front[0].locked) {
                    _this.front[0].sendCommand(command[Math.floor(Math.random() * command.length)]);
                    var motor_front = _this.front[0];
                    _this.front.shift();
                    setTimeout(() => {
                        motor_front.sendCommand(0x14);
                    }, _this.where[0].motors[0].getFPS() + 1000);
                }
                if (_this.left[0] && !_this.left[0].locked) {
                    _this.left[0].sendCommand(command[Math.floor(Math.random() * command.length)]);
                    var motor_left = _this.left[0];
                    _this.left.shift();
                    setTimeout(() => {
                        motor_left.sendCommand(0x14);
                    }, _this.where[0].motors[0].getFPS() + 1000);
                }
                if (_this.roof[0] && !_this.roof[0].locked) {
                    _this.roof[0].sendCommand(command[Math.floor(Math.random() * command.length)]);
                    var motor_roof = _this.roof[0];
                    _this.roof.shift();
                    setTimeout(() => {
                        motor_roof.sendCommand(0x14);
                    }, _this.where[0].motors[0].getFPS() + 1000);
                }
                if (_this.roof[0] && !_this.roof[0].locked) {
                    _this.roof[0].sendCommand(command[Math.floor(Math.random() * command.length)]);
                    var motor_roof_2 = _this.roof[0];
                    _this.roof.shift();
                    setTimeout(() => {
                        motor_roof_2.sendCommand(0x14);
                    }, _this.where[0].motors[0].getFPS() + 1000);
                }
                var steps = 1; // 1 step is 9deg
                setTimeout(_this.idle, (_this.where[0].motors[0].getFPS() * steps) + 250);
            } else {
                if (_this.loop) {
                    _this.reset();
                    _this.idle();
                } else {
                    helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                }
            }
        } else if (_this.type == 'spiral') {
            if (_this.spiralCounter < 28) {
                [_this.where[0], _this.where[1], _this.where[2]].forEach((wall) => {
                    if (wall.name == 'right' || wall.name == 'front') {
                        wall.motors.forEach((motor) => {
                            if (motor.x == _this.spiralXR && motor.y == _this.spiralYR) {
                                motor.sendCommand(0x19);
                            }
                            if (motor.x == (10 - _this.spiralXR) && motor.y == (4 - _this.spiralYR)) {
                                motor.sendCommand(0x19);
                            }
                            // if ((10 - _this.spiralXR) == 10 && motor.x > 10 && motor.y == (4 - _this.spiralYR)) {
                            //     motor.sendCommand(0x19);
                            // }
                        });
                    } else if (wall.name == 'left') {
                        wall.motors.forEach((motor) => {
                            if (motor.x == _this.spiralXL-17 && motor.y == _this.spiralYL) {
                                motor.sendCommand(0x19);
                            }
                            if (motor.x == (56 - _this.spiralXL-17) && motor.y == (4 - _this.spiralYL)) {
                                motor.sendCommand(0x19);
                            }
                            // if (_this.spiralXL-17 == 23 && motor.x < 23 && motor.y == _this.spiralYL) {
                            //     motor.sendCommand(0x19);
                            // }
                        });
                    }
                });
                if (_this.spiralCounter < 3) {
                    _this.spiralXR--;
                    _this.spiralXL--;
                } else if (_this.spiralCounter < 4) {
                    _this.spiralYR--;
                    _this.spiralYL--;
                } else if (_this.spiralCounter < 11) {
                    _this.spiralXR++;
                    _this.spiralXL++;
                } else if (_this.spiralCounter < 14) {
                    _this.spiralYR++;
                    _this.spiralYL++;
                } else if (_this.spiralCounter < 23) {
                    _this.spiralXR--;
                    _this.spiralXL--;
                } else if (_this.spiralCounter < 27) {
                    _this.spiralYR--;
                    _this.spiralYL--;
                }
                _this.spiralCounter++;
                _this.spiralTimer = _this.spiralTimer * 0.9;
                setTimeout(_this.idle, _this.spiralTimer);
            } else {
                _this.spiralYR = 0;
                _this.spiralXR = 0;
                _this.spiralYL = 0;
                _this.spiralXL = 23;
                var steps = 10;
                setTimeout(_this.idleBack, (_this.where[0].motors[0].getFPS() * steps) + 10);
            }
        } else if (_this.type == 'glass') {
            _this.where.forEach((wall, wallIndex) => {
                wall.motors.forEach((motor, motorIndex) => {
                    motor.sendCommand(0x37);
                });
            });
            _this.currentCol = 0;
            var steps = 70;
            setTimeout(_this.idleGlass, (_this.where[0].motors[0].getFPS() * steps) + 250);
        } else if (_this.type == 'TEST') {
            _this.where.forEach((wall, wallIndex) => {
                wall.motors.forEach((motor, motorIndex) => {
                    motor.sendCommand(0x3c);
                });
            });
            var steps = 50;
            setTimeout(_this.idleTest, (_this.where[0].motors[0].getFPS() * steps));
        }
    }
    _this.init = () => {
        if (!_this.running) {
            _this.reset();
            if (_this.type == 'breathing') {
                _this.currentCol = 0;
            }
            _this.idle();
            helper.logger.debug(`${_this.name} STARTED`);
        } else {
            helper.logger.debug(`${_this.name} already RUNNING`);
        }
    }
}
