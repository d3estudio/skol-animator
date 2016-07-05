// main functions
var helper = require('../lib/shared');

//libs
var Alphabet = require('../lib/alphabet');

module.exports = function Flag(where, type) {
    var _this = this;
    _this.name = 'FlagAnimation';
    _this.where = where;
    _this.type = type;
    _this.roof_flag = new Alphabet('!').textToBin()[0];
    _this.roof_front_flag = new Alphabet('_').textToBin()[0];
    _this.draw = () => {
        if (_this.type == 'roof') {
            _this.where[0].motors.forEach((motor) => {
                _this.roof_flag.forEach((line, lineIndex) => {
                    line.forEach((column, columnIndex) => {
                        if (motor.x == columnIndex && motor.y == lineIndex) {
                            if (column == 0) {
                                motor.sendCommand(0x14);
                            } else if (column == 1) {
                                setTimeout(() => {
                                    motor.sendCommand(0x1E);
                                }, _this.where[0].motors[0].getFPS() * 20);
                            } else if (column == 2) {
                                motor.sendCommand(0x28);
                            }
                        }
                    });
                });
            });
            _this.where[1].motors.forEach((motor) => {
                motor.sendCommand(0x14);
            });
        } else {
            _this.where[0].motors.forEach((motor) => {
                _this.roof_front_flag.forEach((line, lineIndex) => {
                    line.forEach((column, columnIndex) => {
                        if (motor.x == columnIndex && motor.y == lineIndex) {
                            if (column == 0) {
                                motor.sendCommand(0x14);
                            } else if (column == 1) {
                                setTimeout(() => {
                                    motor.sendCommand(0x1E);
                                }, _this.where[0].motors[0].getFPS() * 20);
                            } else if (column == 2) {
                                motor.sendCommand(0x28);
                            }
                        }
                    });
                });
            });
            _this.where[1].motors.forEach((motor) => {
                _this.roof_front_flag.forEach((line, lineIndex) => {
                    if (lineIndex > 16) {
                        line.forEach((column, columnIndex) => {
                            if (motor.x == columnIndex && motor.y == lineIndex - 17) {
                                if (column == 0) {
                                    motor.sendCommand(0x14);
                                } else if (column == 1) {
                                    setTimeout(() => {
                                        motor.sendCommand(0x1E);
                                    }, _this.where[0].motors[0].getFPS() * 20);
                                } else if (column == 2) {
                                    motor.sendCommand(0x28);
                                }
                            }
                        });
                    }
                });
            });
        }
        helper.logger.debug(`${_this.name} almost FINISHED (waiting last command)`);
    }
    _this.init = () => {
        if (!_this.running) {
            _this.draw();
            helper.logger.debug(`${_this.name} STARTED`);
        } else {
            helper.logger.debug(_this.name, _this.message, 'already RUNNING');
        }
    }
}
