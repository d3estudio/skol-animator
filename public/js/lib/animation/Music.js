var Music = function(type, width, where, auto, loop) {
    var _this = this;
    _this.name = 'OlaAnimation';
    _this.type = type;
    _this.width = parseInt(width);
    _this.currentCol = 0;
    _this.where = where;
    _this.running = false;
    _this.auto = auto;
    _this.loop = loop;
    _this.command = 0x1E;

    _this.boom = function() {
        if (_this.currentCol < 22) {
            if (_this.currentCol < 5) {
                _this.where[1].motors.forEach(function(motor) {
                    if (_this.currentCol == 0) {
                        if (motor.x>3 && motor.x < 7 && motor.y == 4) {
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
                _this.where[0].motors.forEach(function(motor) {
                    var x = _this.currentCol - 5;
                    if (motor.x == x) {
                        if (motor.command == 0x14) {
                            motor.sendCommand(_this.command);
                        } else {
                            motor.sendCommand(0x14);
                        }
                    }
                });
                _this.where[2].motors.forEach(function(motor) {
                    var x = (33 - (_this.currentCol - 5));
                    if (motor.x == x) {
                        if (motor.command == 0x14) {
                            motor.sendCommand(_this.command);
                        } else {
                            motor.sendCommand(0x14);
                        }
                    }
                });
                _this.where[3].motors.forEach(function(motor) {
                    var y = (33 - (_this.currentCol - 5));
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
            if (_this.loop) {
                _this.currentCol = 0;
                var steps = 20; // 1 step is 9deg
                setTimeout(_this.boom, (_this.where[0].motors[0].getFPS() * steps) + 10);
            } else {
                console.warn(_this.name, 'FINISHED (waiting last command)');
            }
        }
    }
    _this.init = function() {
        if (!_this.running) {
            if (_this.type == 'very_fast_boom') {
                _this.command = 0x16;
                _this.boom();
            }
            if (_this.type == 'fast_boom') {
                _this.command = 0x19;
                _this.boom();
            }
            if (_this.type == 'boom') {
                _this.command = 0x1E;
                _this.boom();
            }
            if (_this.type == 'long_boom') {
                _this.command = 0x28;
                _this.boom();
            }
            _this.running = true;
        } else {
            console.warn(_this.name, 'already RUNNING');
        }
    }
}
