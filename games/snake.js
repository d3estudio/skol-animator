// main functions
var helper = require('../lib/shared');

//libs
var Alphabet = require('../lib/alphabet');

module.exports = function Snake(where) {
    var _this = this;
    _this.name = 'SnakeGame';
    _this.where = where;
    _this.col = 10;
    _this.line = 2;
    _this.dirCol = -1;
    _this.dirLine = 0;
    _this.points = 0;
    _this.fps = _this.where[0].motors[0].getFPS() * 10;
    _this.gameWall = [_this.where[1], _this.where[3]];
    _this.pointWall = _this.where[2];
    _this.dead = false;

    _this.drawFace = (face) => {
        var face = new Alphabet(face);
        face = face.textToBin();
        var shift = 0;
        face.forEach((letter, letterIndex) => {
            letter.forEach((line, lineIndex) => {
                line.forEach((dot, dotIndex) => {
                    var x = dotIndex + shift,
                        y = lineIndex;
                    _this.pointWall.motors.forEach((motor) => {
                        if (motor.x == x && motor.y == y) {
                            if (dot) {
                                motor.sendCommand(0x14);
                            } else {
                                motor.sendCommand(0x28);
                            }
                        }
                    });
                });
            });
            shift += letter[0].length;
        });
    }
    _this.drawPoints = () => {
        var points = _this.points;
        if (points < 10) {
            points = '0' + points;
        }
        var point = new Alphabet('-' + points + '-');
        point = point.textToBin();
        var shift = 0;
        point.forEach((letter, letterIndex) => {
            letter.forEach((line, lineIndex) => {
                line.forEach((dot, dotIndex) => {
                    var x = dotIndex + shift,
                        y = lineIndex;
                    _this.pointWall.motors.forEach((motor) => {
                        if (motor.x == x && motor.y == y) {
                            if (dot) {
                                motor.sendCommand(0x28);
                            } else {
                                motor.sendCommand(0x14);
                            }
                        }
                    });
                });
            });
            shift += letter[0].length;
        });
    }
    _this.drawFood = () => {
        var x = -1;
        var y = -1;
        var motor = _this.gameWall[0].motors[Math.round(Math.random()*(_this.gameWall[0].motors.length-1))];
        if (motor.command == 0x14 && !motor.locked) {
            x = motor.x;
            y = 2;
            _this.gameWall.forEach((wall) => {
                wall.motors.forEach((motor) => {
                    if (wall.name == 'right') {
                        if (motor.x == x-5 && motor.y == y) {
                            motor.sendCommand(0x28);
                        }
                    } else {
                        if (motor.x == x && motor.y == y) {
                            motor.sendCommand(0x28);
                        }
                    }
                })
            });
            _this.computing = false;
        } else {
            _this.drawFood();
        }
    }
    _this.draw = () => {
        _this.gameWall.forEach((wall) => {
            var x = _this.col;
            var y = _this.line;
            if (wall.name == 'left') {
                x = x + 5;
            }
            if (wall.name == 'left') {
                if (x < 5 || x > 16 || y < 0 || y > 4) {
                    _this.dead = true;
                }
            }
            wall.motors.forEach((motor) => {
                if (motor.x == x && motor.y == y) {
                    if (!_this.dead) {
                        if (motor.command == 0x28 && wall.name == 'left') {
                            _this.points += 1;
                            _this.drawFood();
                            _this.drawPoints();
                        }
                        motor.sendCommand(0x1E);
                        setTimeout(() => {
                            motor.sendCommand(0x14);
                        }, _this.fps * 2);
                    }
                }
            })
        });
        if (!_this.dead) {
            _this.col += _this.dirCol;
            _this.line += _this.dirLine;
            setTimeout(_this.draw, _this.fps);
        } else {
            helper.logger.debug(`${_this.name} DEAD`);
            _this.drawFace('(');
        }
    }
    _this.pressKey = (key) => {
        key = parseInt(key);
        helper.logger.debug(`${_this.name} ${key}`);
        if (key == 119) {
            //w
            _this.dirCol = 0;
            _this.dirLine = -1;
        } else if (key == 97) {
            //a
            _this.dirCol = -1;
            _this.dirLine = 0;
        } else if (key == 115) {
            //s
            _this.dirCol = 0;
            _this.dirLine = 1;
        } else if (key == 100) {
            //d
            _this.dirCol = 1;
            _this.dirLine = 0;
        } else {
            helper.logger.debug(`${_this.name} INVALID KEY FOR THIS GAME`);
        }
    }
    _this.start = () => {
        //clean the roof
        _this.where[0].motors.forEach((motor) => {
            motor.sendCommand(0x28);
        });
        _this.gameWall.forEach((wall) => {
            if (wall.name == 'left') {
                wall.motors.forEach((motor) => {
                    if (motor.x < 5) {
                        motor.sendCommand(0x28);
                    } else {
                        motor.sendCommand(0x14);
                    }
                });
            } else if (wall.name == 'right') {
                wall.motors.forEach((motor) => {
                    if (motor.x > 11) {
                        motor.sendCommand(0x28);
                    } else {
                        motor.sendCommand(0x14);
                    }
                });
            }
        })
        _this.drawFace(')');
        setTimeout(_this.drawFood, 5000);
        setTimeout(_this.draw, 3000);
        helper.logger.debug(`${_this.name} STARTED`);
    }
}

//[roof, leftWall, frontWall, rightWall]
