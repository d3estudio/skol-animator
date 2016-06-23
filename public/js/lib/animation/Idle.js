var Idle = function(type, width, where, loop) {
    var _this = this;
    var shuffle = function(a) {
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
    _this.reset = function() {
        _this.right = shuffle(where[0].motors.slice(0));
        _this.front = shuffle(where[1].motors.slice(0));
        _this.left = shuffle(where[2].motors.slice(0));
        _this.roof = shuffle(where[3].motors.slice(0));
    }
    _this.idleBack = function() {
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
                var steps = 2; // 1 step is 9deg
                setTimeout(_this.idleBack, _this.where[0].motors[0].getFPS() * steps);
            } else {
                if (_this.loop) {
                    _this.command = 0x3C;
                    _this.reset();
                    _this.idle();
                } else {
                    console.warn(_this.name, 'FINISHED (waiting last command)');
                }
            }
        } else {
            if (_this.currentCol > -6) {
                _this.where[0].motors.forEach(function(motor) {
                    var x = _this.currentCol + _this.where[0].offset;
                    if (motor.x == x) {
                        motor.sendCommand(0x14);
                    }
                });
                _this.where[3].motors.forEach(function(motor) {
                    var y = 15 + ((-18 - (_this.currentCol * -1)) * -1);
                    if (motor.y == y) {
                        motor.sendCommand(0x14);
                    }
                });
                _this.where[2].motors.forEach(function(motor) {
                    var x = 15 + ((-18 - (_this.currentCol * -1)) * -1);
                    if (motor.x == x) {
                        motor.sendCommand(0x14);
                    }
                });
                if (_this.currentCol < 0) {
                    _this.where[1].motors.forEach(function(motor) {
                        if (_this.currentCol == -1) {
                            if (motor.x==0 || motor.x == 10 ||  motor.y == 0) {
                                motor.sendCommand(0x14);
                            }
                        }
                        if (_this.currentCol == -2) {
                            if (motor.x==1 || motor.x == 9 ||  motor.y == 1) {
                                motor.sendCommand(0x14);
                            }
                        }
                        if (_this.currentCol == -3) {
                            if (motor.x==2 || motor.x == 8 ||  motor.y == 2) {
                                motor.sendCommand(0x14);
                            }
                        }
                        if (_this.currentCol == -4) {
                            if (motor.x==3 || motor.x == 7 ||  motor.y == 3) {
                                motor.sendCommand(0x14);
                            }
                        }
                        if (_this.currentCol == -5) {
                            if (motor.x==4 || motor.x == 6 ||  motor.y == 4) {
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
                    console.warn(_this.name, 'FINISHED (waiting last command)');
                }
            }
        }
    }
    _this.idle = function() {
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
                var steps = 2; // 1 step is 9deg
                setTimeout(_this.idle, _this.where[0].motors[0].getFPS() * steps);
            } else {
                _this.command = 0x14;
                _this.reset();
                _this.idleBack();
            }
        } else {
            _this.where.forEach(function(wall) {
                wall.motors.forEach(function(motor) {
                    motor.sendCommand(0x1E);
                });
            });
            var steps = 10; // 1 step is 9deg
            setTimeout(_this.idleBack, (_this.where[0].motors[0].getFPS() * steps) + 10);
        }
    }
    _this.init = function() {
        if (!_this.running) {
            _this.reset();
            _this.idle();
        } else {
            console.warn(_this.name, 'already RUNNING');
        }
    }
}
