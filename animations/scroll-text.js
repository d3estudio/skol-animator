// main functions
var helper = require('../lib/shared');

//libs
var Alphabet = require('../lib/alphabet');

module.exports = function ScrollText(message, width, where, overflow, loop) {
    var _this = this;
    _this.name = 'ScrollTextAnimation';
    _this.width = width;
    _this.where = where;
    _this.message = new Alphabet(message + '--');
    _this.currentCol = _this.width - 1;
    _this.idleCurrentCol = 0;
    _this.idleCommand = 0x14;
    _this.running = false;
    _this.overflow = overflow;
    _this.loop = loop;
    _this.moveLetters = () => {
            var shift = 0;
            var letterList = _this.message.textToBin();
            letterList.forEach((letter, letterIndex) => {
                letter.forEach((line, lineIndex) => {
                    line.forEach((dot, dotIndex) => {
                        var x = _this.currentCol + dotIndex + shift,
                            y = lineIndex;
                        [_this.where[0], _this.where[2]].forEach((wall, wallIndex) => {
                            wall.motors.forEach((motor) => {
                                if (motor.x == (x + wall.offset) && motor.y == y) {
                                    if (dot) {
                                        motor.sendCommand(0x28);
                                    } else {
                                        motor.sendCommand(0x14);
                                    }
                                } else if (motor.x < wall.offset) {
                                    motor.sendCommand(0x14);
                                }
                            });
                        });
                    });
                });
                shift += letter[0].length;
            });
        }
        //continuous behavior
    _this.moveLettersOverflow = () => {
            var shift = 0;
            var letterList = _this.message.textToBin();
            letterList.forEach((letter, letterIndex) => {
                letter.forEach((line, lineIndex) => {
                    line.forEach((dot, dotIndex) => {
                        _this.where[0].motors.forEach((motor) => {
                            var x = _this.currentCol + dotIndex + shift,
                                y = lineIndex;
                            if (motor.x == (x + _this.where[0].offset) && motor.y == y) {
                                if (dot) {
                                    motor.sendCommand(0x28);
                                } else {
                                    motor.sendCommand(0x14);
                                }
                            }
                        });
                        if (_this.currentCol < 0) {
                            _this.where[1].motors.forEach((motor) => {
                                var x = _this.currentCol + dotIndex + shift + _this.where[1].width,
                                    y = lineIndex;
                                if (motor.x == (x + _this.where[1].offset) && motor.y == y) {
                                    if (dot) {
                                        motor.sendCommand(0x28);
                                    } else {
                                        motor.sendCommand(0x14);
                                    }
                                }
                            });
                        }
                        if (_this.currentCol < -11) {
                            _this.where[2].motors.forEach((motor) => {
                                var x = _this.currentCol + dotIndex + shift + _this.where[2].width - 6,
                                    y = lineIndex;
                                if (motor.x == x && motor.y == y) {
                                    if (dot) {
                                        motor.sendCommand(0x28);
                                    } else {
                                        motor.sendCommand(0x14);
                                    }
                                }
                            });
                        }
                    })
                });
                shift += letter[0].length;
            });
        }
        //general finish
    _this.finish = () => {
            _this.idleCurrentCol = 0;
            _this.idleCommand = 0x14;
            if (!_this.overflow) {
                //_this.idle();
                helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
                _this.ended(5000); // wait 10 senconds after i have finished
            } else {
                if (_this.loop) {
                    _this.currentCol = _this.width - 1;
                    _this.draw();
                }
            }

        }
        //animated behavior
    _this.step4 = () => {
        _this.currentCol += 1
        _this.moveLetters();
        if (_this.loop) {
            _this.currentCol -= 1;
            var steps = 40; // 1 step is 9deg // 3000 is an animation delay after roration
            setTimeout(_this.step2, (_this.where[0].motors[0].getFPS() * (steps + 10)) + 6000);
        } else {
            _this.finish();
        }
    }
    _this.step3 = () => {
        [_this.where[0], _this.where[2]].forEach((wall, wallIndex) => {
            wall.motors.forEach((motor) => {
                //go to 180deg
                if (motor.command == 0x28) {
                    motor.sendCommand(0x14);
                } else if (motor.command == 0x14) {
                    motor.sendCommand(0x28);
                }
            });
        });
        var steps = 40; // 1 step is 9deg // 3000 is an animation delay after roration
        setTimeout(_this.step4, (_this.where[0].motors[0].getFPS() * (steps + 10)) + 3000);
    }
    _this.step2 = () => {
        [_this.where[0], _this.where[2]].forEach((wall, wallIndex) => {
            wall.motors.forEach((motor) => {
                if (motor.command == 0x28) {
                    motor.sendCommand(0x14);
                } else if (motor.command == 0x14) {
                    motor.sendCommand(0x28);
                }
            });
        });
        var steps = 20; // 1 step is 9deg // 3000 is an animation delay after roration
        setTimeout(_this.step3, (_this.where[0].motors[0].getFPS() * (steps + 10)) + 3000);
        _this.resetIdle();
        _this.idle();
    }
    _this.resetIdle = () => {
        _this.idleCurrentCol = 0;
        if (_this.idleCommand == 0x28) {
            _this.idleCommand = 0x14;
        } else {
            _this.idleCommand = 0x28;
        }
    }
    _this.idle = () => {
        if (_this.idleCurrentCol < 17) {
            [_this.where[1], _this.where[3]].forEach((wall, wallIndex) => {
                wall.motors.forEach((motor) => {
                    var y = wall.name == 'top' ? (16 - _this.idleCurrentCol) : _this.idleCurrentCol;
                    if (motor.y == y) {
                        motor.sendCommand(_this.idleCommand);
                    }
                });
            });
            _this.idleCurrentCol += 1;
            var steps = 5; // 1 step is 9deg
            setTimeout(_this.idle, (_this.where[0].motors[0].getFPS() * steps));
        }
    }
    _this.draw = () => {
        var steps = 40; // 1 step is 9deg
        setTimeout(() => {
            if (_this.overflow) {
                if (_this.currentCol > ((_this.message.size * -1) - 25)) {
                    _this.moveLettersOverflow();
                    _this.currentCol--;
                    _this.draw();
                } else {
                    _this.finish();
                }
            } else {
                if (_this.currentCol > -1) {
                    _this.moveLetters();
                    _this.currentCol--;
                    _this.draw();
                } else {
                    _this.step2();
                }
            }
        }, _this.where[0].motors[0].getFPS() * (steps + 10)); //number of steps (each 9 degrees to the angle) + 10
    }
    _this.init = () => {
        if (!_this.running) {
            _this.draw();
            helper.logger.debug(`${_this.name} STARTED`);
        } else {
            helper.logger.debug(`${_this.name} already RUNNING`);
        }
    }
    _this.ended = (timeToWait) => {}
}
