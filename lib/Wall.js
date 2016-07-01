// main functions
var helper = require('../lib/Shared');

//libs
var Motor = require('./Motor')

//creates a wall of motors
module.exports = function Wall(size, width, name, offset, socket) {
    var _this = this;
    _this.name = name;
    _this.size = size;
    _this.width = width;
    _this.created = false;
    _this.motors = [];
    _this.offset = offset;
    _this.socket = socket;
    _this.locked = false;
    _this.update = () => {
        if (!_this.locked) {
            _this.socket.emit('update', {
                wall: _this.name == 'top' ? 'roof' : _this.name + 'Wall',
                motors: _this.motors.map((motor) => {
                    return motor.command
                })
            });
            if (_this.motors[0].command >= 0xFB && _this.motors[0].command <= 0xFF) {
                _this.locked = true;
                helper.logger.debug(`WALL ${_this.name} LOCKED`);
            }
        } else {
            if (_this.motors[0].command >= 0x00 && _this.motors[0].command <= 0xF0) {
                _this.locked = false;
                helper.logger.debug(`WALL ${_this.name} UNLOCKED`);
            }
        }
        setTimeout(_this.update, _this.motors[0].getFPS());
    }
    _this.init = () => {
        if (!_this.created) {
            for (var i = 0; i < _this.size; i++) {
                var y = parseInt(i / _this.width),
                    x = parseInt(i - (_this.width * y));
                if (_this.name == 'left') {
                    x = x - 17;
                }
                if (_this.name == 'top') {
                    y = y - 17;
                }

                var motor = new Motor(x, y, _this.name);
                //helper.logger.debug(`ADDED MOTOR ${motor.name} TO WALL ${_this.name}`);

                if (y < 6 && _this.name == 'top') {
                    if (y == 5 && (x == 0 || x == 2 || x == 4 || x == 5 || x == 6 || x == 8 || x == 9 || x == 10)) {
                        _this.motors.push(motor);
                    } else if (y == 4 && (x == 0 || x == 1 || x == 3 || x == 6 || x == 7 || x == 10)) {
                        _this.motors.push(motor);
                    } else if (y == 3 && (x == 2 || x == 3 || x == 5 || x == 7 || x == 10)) {
                        _this.motors.push(motor);
                    } else if (y == 2 && (x == 1 || x == 6 || x == 7 || x == 9)) {
                        _this.motors.push(motor);
                    } else if (y == 1 && (x == 0 || x == 4 || x == 6)) {
                        _this.motors.push(motor);
                    } else if (y == 0 && (x == 3)) {
                        _this.motors.push(motor);
                    }
                } else if (x < 4 && _this.name == 'left') {
                    if (x == 0 && y == 1) {
                        _this.motors.push(motor);
                    } else if (x == 1 && (y == 0 || y == 3)) {
                        _this.motors.push(motor);
                    } else if (x == 2 && (y == 1 || y == 4)) {
                        _this.motors.push(motor);
                    } else if (x == 3 && (y == 1 || y == 3)) {
                        _this.motors.push(motor);
                    }
                } else if (x > 12 && _this.name == 'right') {
                    if (x == 13 && (y == 0 || y == 1 || y == 4)) {
                        _this.motors.push(motor);
                    } else if (x == 14 && y == 2) {
                        _this.motors.push(motor);
                    } else if (x == 15 && y == 1) {
                        _this.motors.push(motor);
                    } else if (x == 16 && y == 3) {
                        _this.motors.push(motor);
                    }
                } else {
                    _this.motors.push(motor);
                }
            }
            helper.logger.debug(`WALL ${_this.name} CREATED`);
            _this.created = true;
            _this.update();
        } else {
            helper.logger.debug(`WALL ${_this.name} EXISTS`);
        }
    }
}
