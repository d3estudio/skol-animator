// main functions
var helper = require('../lib/Shared');

//libs
var Motor = require('./Motor')

//creates a wall of motors
module.exports = function Wall(size, width, name, socket) {
    var _this = this;
    _this.name = name;
    _this.size = size;
    _this.width = width;
    _this.created = false;
    _this.motors = [];
    _this.socket = socket;
    _this.update = () => {
        _this.socket.emit('update', {
            wall: _this.name == 'top' ? 'roof' : _this.name + 'Wall',
            motors: _this.motors.map((motor) => {
                return motor.command
            })
        });
        setTimeout(_this.update, _this.motors[0].getFPS());
    }
    _this.init = () => {
        if (!_this.created) {
            for (var i = 0; i < _this.size; i++) {
                var y = parseInt(i / _this.width),
                    x = parseInt(i - (_this.width * y))
                    motor = new Motor(x, y, _this.name);
                //helper.logger.debug(`ADDED MOTOR ${motor.name} TO WALL ${_this.name}`);

                if (y < 23 && _this.name == 'top') {
                    if (y == 22 && (x == 0 || x == 2 || x == 4 || x == 5 || x == 6 || x == 8 || x == 9 || x == 10)) {
                        _this.motors.push(motor);
                    } else if (y == 21 && (x == 0 || x == 1 || x == 3 || x == 4 || x == 6 || x == 7 || x == 10)) {
                        _this.motors.push(motor);
                    } else if (y == 20 && (x == 2 || x == 3 || x == 5 || x == 7 || x == 9 || x == 10)) {
                        _this.motors.push(motor);
                    } else if (y == 19 && (x == 1 || x == 4 || x == 6 || x == 7 || x == 9)) {
                        _this.motors.push(motor);
                    } else if (y == 18 && (x == 0 || x == 4 || x == 6)) {
                        _this.motors.push(motor);
                    } else if (y == 17 && (x == 1 || x == 8)) {
                        _this.motors.push(motor);
                    } else if (y == 16 && (x == 0 || x == 5)) {
                        _this.motors.push(motor);
                    }
                } else if (x < 22 && _this.name == 'left') {
                    if (x == 15 && (y == 2)) {
                        _this.motors.push(motor);
                    } else if (x == 16 && (y == 1)) {
                        _this.motors.push(motor);
                    } else if (x == 17 && (y == 0 || y == 3)) {
                        _this.motors.push(motor);
                    } else if (x == 18 && (y == 1 || y == 4)) {
                        _this.motors.push(motor);
                    } else if (x == 19 && (y == 1 || y == 3)) {
                        _this.motors.push(motor);
                    } else if (x == 20 && (y == 0 || y == 2 || y == 4)) {
                        _this.motors.push(motor);
                    } else if (x == 21 && (y == 1 || y == 2 || y == 4)) {
                        _this.motors.push(motor);
                    }
                } else if (x > 10 && _this.name == 'right') {
                    if (x == 11 && (y == 0 || y == 1 || y == 2 || y == 4)) {
                        _this.motors.push(motor);
                    } else if (x == 12 && (y == 0 || y == 3)) {
                        _this.motors.push(motor);
                    } else if (x == 13 && (y == 0 || y == 1 || y == 4)) {
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
