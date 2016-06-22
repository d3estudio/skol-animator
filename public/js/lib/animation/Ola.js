var Ola = function(type, width, where, loop) {
    var _this = this;
    _this.name = 'OlaAnimation';
    _this.type = type;
    _this.width = parseInt(width);
    _this.currentCol = _this.width + 3;
    _this.currentColErase = _this.width + 3;
    _this.where = where;
    _this.running = false;
    _this.loop = loop;
    _this.eraseWave = function() {
        if (_this.type == 'little') {
            if (_this.currentColErase > -37) {
                _this.where[0].motors.forEach(function(motor) {
                    var x = _this.currentColErase + _this.where[0].offset;
                    if (motor.x == (x - motor.y)) {
                        motor.sendCommand(0x14);
                    }
                });
                if (_this.currentColErase < 5) {
                    _this.where[1].motors.forEach(function(motor) {
                        var x = _this.currentColErase + _this.where[1].width + _this.where[1].offset;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0x14);
                        }
                    });
                }
                if (_this.currentColErase < -6) {
                    _this.where[2].motors.forEach(function(motor) {
                        var x = _this.currentColErase + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0x14);
                        }
                    });
                    _this.where[3].motors.forEach(function(motor) {
                        var y = 45 - (_this.currentColErase * -1);
                        if (motor.y == y) {
                            motor.sendCommand(0x14);
                        }
                    });
                }
                _this.currentColErase--;
                var steps = 5; // 1 step is 9deg // 3000 is an animation delay after roration
                setTimeout(_this.eraseWave, (_this.where[0].motors[0].getFPS() * steps) + 10);
            } else {
                if (_this.loop) {
                    _this.currentCol = _this.width + 3;
                    _this.currentColErase = _this.width + 3;
                    _this.wave();
                } else {
                    console.info(_this.name, _this.message, 'FINISHED (waiting last command)');
                }
            }
        } else {
            if (_this.currentColErase > -37) {
                _this.where[0].motors.forEach(function(motor) {
                    var x = _this.currentColErase + _this.where[0].offset;
                    if (motor.x == x) {
                        motor.sendCommand(0x14);
                    }
                });

                _this.where[3].motors.forEach(function(motor) {
                    var y = 17 + ((_this.currentColErase - 16) * - 1);
                    if (motor.y == y) {
                        motor.sendCommand(0x14);
                    }
                });

                if (_this.currentColErase < 5) {
                    _this.where[1].motors.forEach(function(motor) {
                        var x = _this.currentColErase + _this.where[1].width + _this.where[1].offset;
                        if (motor.x == x) {
                            motor.sendCommand(0x14);
                        }
                    });
                }
                if (_this.currentColErase < -6) {
                    _this.where[2].motors.forEach(function(motor) {
                        var x = _this.currentColErase + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == x) {
                            motor.sendCommand(0x14);
                        }
                    });
                }
                _this.currentColErase--;
                var steps = 5; // 1 step is 9deg // 3000 is an animation delay after roration
                setTimeout(_this.eraseWave, (_this.where[0].motors[0].getFPS() * steps) + 10);
            } else {
                if (_this.loop) {
                    _this.currentCol = _this.width + 3;
                    _this.currentColErase = _this.width + 3;
                    _this.wave();
                } else {
                    console.info(_this.name, _this.message, 'FINISHED (waiting last command)');
                }
            }
        }
    }
    _this.wave = function() {
        if (_this.type == 'little') {
            if (_this.currentCol > -37) {
                _this.where[0].motors.forEach(function(motor) {
                    var x = _this.currentCol + _this.where[0].offset;
                    if (motor.x == (x - motor.y)) {
                        motor.sendCommand(0x3C);
                    }
                });

                _this.where[3].motors.forEach(function(motor) {
                    var y = 17 + ((_this.currentCol - 16) * - 1);
                    if (motor.y == y) {
                        motor.sendCommand(0x3C);
                    }
                });

                if (_this.currentCol < 5) {
                    _this.where[1].motors.forEach(function(motor) {
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
                    _this.where[2].motors.forEach(function(motor) {
                        var x = _this.currentCol + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == (x - motor.y)) {
                            motor.sendCommand(0x3C);
                        }
                    });
                }
                _this.currentCol--;
                var steps = 5; // 1 step is 9deg // 3000 is an animation delay after roration
                setTimeout(_this.wave, (_this.where[0].motors[0].getFPS() * steps) + 10);
            }
        } else {
            if (_this.currentCol > -37) {
                _this.where[0].motors.forEach(function(motor) {
                    var x = _this.currentCol + _this.where[0].offset;
                    if (motor.x == x) {
                        motor.sendCommand(0xF0);
                    }
                });

                _this.where[3].motors.forEach(function(motor) {
                    var y = 17 + ((_this.currentCol - 16) * - 1);
                    if (motor.y == y) {
                        motor.sendCommand(0xF0);
                    }
                });

                if (_this.currentCol < 5) {
                    _this.where[1].motors.forEach(function(motor) {
                        var x = _this.currentCol + _this.where[1].width + _this.where[1].offset;
                        if (motor.x == x) {
                            motor.sendCommand(0xF0);
                        }
                    });
                }
                if (_this.currentCol == -6) {
                    _this.eraseWave();
                }
                if (_this.currentCol < -6) {
                    _this.where[2].motors.forEach(function(motor) {
                        var x = _this.currentCol + _this.where[2].width + _this.where[2].offset - 10;
                        if (motor.x == x) {
                            motor.sendCommand(0xF0);
                        }
                    });
                }
                _this.currentCol--;
                console.debug('COL', _this.currentCol);
                var steps = 5; // 1 step is 9deg // 3000 is an animation delay after roration
                setTimeout(_this.wave, (_this.where[0].motors[0].getFPS() * steps) + 10);
            }
        }
    }
    _this.init = function() {
        if (!_this.running) {
            _this.wave();
        } else {
            console.warn(_this.name, _this.message, 'already RUNNING');
        }
    }
}
