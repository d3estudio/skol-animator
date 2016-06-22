var ScrollText = function(message, width, height, where, overflow, loop) {
    var _this = this;
    _this.name = 'ScrollTextAnimation';
    _this.width = parseInt(width);
    _this.height = parseInt(height);
    _this.where = where;
    _this.message = new Alphabet(message);
    _this.currentCol = _this.width - 1;
    _this.idleCurrentCol = 0;
    _this.idleCommand = 0x14;
    _this.running = false;
    _this.overflow = overflow;
    _this.loop = loop;
    _this.moveLetters = function() {
            var shift = 0;
            var letterList = _this.message.textToBin();
            letterList.forEach(function(letter, letterIndex) {
                letter.forEach(function(line, lineIndex) {
                    line.forEach(function(dot, dotIndex) {
                        var x = _this.currentCol + dotIndex + shift,
                            y = lineIndex,
                            bit;
                        [_this.where[0], _this.where[2]].forEach(function(wall, wallIndex) {
                            wall.motors.forEach(function(motor) {
                                if (motor.x == (x + wall.offset) && motor.y == y) {
                                    if (dot) {
                                        motor.sendCommand(0x1E);
                                    } else {
                                        motor.sendCommand(0x14);
                                    }
                                }
                            });
                        });
                    })
                });
                shift += letter[0].length;
            });
        }
        //continuous behavior
    _this.moveLettersOverflow = function() {
            var shift = 0;
            var letterList = _this.message.textToBin();
            letterList.forEach(function(letter, letterIndex) {
                letter.forEach(function(line, lineIndex) {
                    line.forEach(function(dot, dotIndex) {
                        _this.where[0].motors.forEach(function(motor) {
                            var x = _this.currentCol + dotIndex + shift,
                                y = lineIndex;
                            if (motor.x == (x + _this.where[0].offset) && motor.y == y) {
                                if (dot) {
                                    motor.sendCommand(0x1E);
                                } else {
                                    motor.sendCommand(0x14);
                                }
                            }
                        });
                        if (_this.currentCol < 0) {
                            _this.where[1].motors.forEach(function(motor) {
                                var x = _this.currentCol + dotIndex + shift + _this.where[1].width,
                                    y = lineIndex;
                                if (motor.x == (x + _this.where[1].offset) && motor.y == y) {
                                    if (dot) {
                                        motor.sendCommand(0x1E);
                                    } else {
                                        motor.sendCommand(0x14);
                                    }
                                }
                            });
                        }
                        if (_this.currentCol < -11) {
                            _this.where[2].motors.forEach(function(motor) {
                                var x = (_this.currentCol + 11) + dotIndex + shift + _this.where[2].width,
                                    y = lineIndex;
                                if (motor.x == x && motor.y == y) {
                                    if (dot) {
                                        motor.sendCommand(0x1E);
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
    _this.finish = function() {
            _this.where.forEach(function(wall, wallIndex) {
                wall.motors.forEach(function(motor) {
                    motor.sendCommand(0x14);
                });
                _this.running = false;
                console.info(_this.name, _this.message, 'FINISHED (waiting last command)');
            });
        }
        //animated behavior
    _this.step4 = function() {
        _this.currentCol += 1
        _this.moveLetters();
        // if (_this.loop) {
        //     var steps = 20; // 1 step is 9deg // 3000 is an animation delay after roration
        //     setTimeout(_this.step2, (_this.where[0].motors[0].getFPS() * (steps + 10)) + 3000);
        // }
        _this.idleCommand = 0x14;
        _this.idleCurrentCol = 0;
        _this.idle();
    }
    _this.step3 = function() {
        [_this.where[0], _this.where[2]].forEach(function(wall, wallIndex) {
            wall.motors.forEach(function(motor) {
                //go to 180deg
                motor.sendCommand(0x28);
            });
        });
        var steps = 20; // 1 step is 9deg // 3000 is an animation delay after roration
        setTimeout(_this.step4, (_this.where[0].motors[0].getFPS() * (steps + 10)) + 3000);
    }
    _this.step2 = function() {
        [_this.where[0], _this.where[2]].forEach(function(wall, wallIndex) {
            wall.motors.forEach(function(motor) {
                if (motor.command != 0x14) {
                    //go to 180deg
                    motor.sendCommand(0x28);
                }
            });
        });
        var steps = 20; // 1 step is 9deg // 3000 is an animation delay after roration
        setTimeout(_this.step3, (_this.where[0].motors[0].getFPS() * (steps + 10)) + 3000);
        _this.idleCommand = 0x1E;
        _this.idle();
    }
    _this.idle = function() {
        //0x1E
        console.debug(_this.idleCurrentCol);
        if (_this.idleCurrentCol < 17) {
            [_this.where[1], _this.where[3]].forEach(function(wall, wallIndex) {
                wall.motors.forEach(function(motor) {
                    var y = wall.name == 'top' ? (33 - _this.idleCurrentCol) : _this.idleCurrentCol;
                    if (motor.y == y) {
                        motor.sendCommand(_this.idleCommand);
                    }
                });
            });
            _this.idleCurrentCol += 1;
            var steps = 5; // 1 step is 9deg // 3000 is an animation delay after roration
            setTimeout(_this.idle, (_this.where[0].motors[0].getFPS() * steps));
        }
    }
    _this.draw = function() {
        var steps = 10; // 1 step is 9deg
        setTimeout(function() {
            if (_this.overflow) {
                if (_this.currentCol > ((_this.message.size * -1) - 25)) {
                    _this.moveLettersOverflow();
                    _this.currentCol--;
                    requestAnimationFrame(_this.draw);
                } else {
                    _this.finish();
                }
            } else {
                if (_this.currentCol > -1) {
                    _this.moveLetters();
                    _this.currentCol--;
                    requestAnimationFrame(_this.draw);
                } else {
                    _this.step2();
                }
            }
        }, _this.where[0].motors[0].getFPS() * (steps + 10)); //number of steps (each 9 degrees to the angle) + 10
    }
    _this.init = function() {
        if (!_this.running) {
            _this.draw();
        } else {
            console.warn(_this.name, _this.message, 'already RUNNING');
        }
    }
}
