//main functions
var helper = require('../lib/shared');

//config file
var config = require('../settings.json');

module.exports = function Motor(x, y, parent) {
    var _this = this;

    //this motor`s parent
    _this.parent = parent;

    //naming for LOGS
    _this.name = _this.parent.toUpperCase() + '_[' + x + '][' + y + ']';

    //index on the matrix
    _this.x = x;
    _this.y = y;

    //motor status
    _this.locked = false;

    //motor current angle
    _this.currentAngle = 0;
    _this.newAngle = 0;

    //motor acceleration mode, and 360 degress rotation time to sync with the real world
    _this.speed = config.SPEED;
    _this.SPEED_TIME = 2.6 * 1000;
    _this.SLOW__TIME = 5.2 * 1000;

    //motor current applied command
    _this.command = 0x14;

    //get FPS
    _this.getFPS = function() {
        var time = 0;
        if (_this.speed) {
            time = (_this.SPEED_TIME / 360) * 9;
        } else {
            time = (_this.SLOW__TIME / 360) * 9;
        }
        return time;
    }

    //lock this motor to wait the current command
    _this.lock = function() {
        _this.locked = true;
    }

    //unlock this motor and allow another command
    _this.unlock = function() {
        _this.locked = false;
    }

    //convert a command to an angle and a time
    _this.getAngleFromCommand = function(cmd) {
        var angle,
            time;
        if (cmd >= 0x00 && cmd <= 0x13) {
            angle = ((0x14 - cmd) * 0x10E) * -1;
        } else if (cmd >= 0x14 && cmd <= 0xDC) {
            angle = (cmd - 0x14) * 0x09;
        } else if (cmd >= 0xDD && cmd <= 0xF0) {
            angle = 0x708 + ((cmd - 0xDC) * 0x10E);
        } else {
            angle = 0x14;
        }
        return angle
    }

    //get the steps to walk between newAngle and currentAngle
    _this.getSteps = function(cmd) {
        if (cmd > _this.command) {
            return (_this.newAngle - _this.currentAngle) / config.MIN_ANGLE;
        } else if (cmd < _this.command) {
            return (_this.currentAngle - _this.newAngle) / config.MIN_ANGLE;
        } else {
            return (_this.newAngle - _this.currentAngle) / config.MIN_ANGLE;
        }
    }

    //send a command to rotate the motor according to the following table:
    _this.sendCommand = function(cmd) {
        if (cmd <= 0xF0) {
            if (cmd != _this.command) {
                _this.newAngle = _this.getAngleFromCommand(cmd);
                _this.currentAngle = _this.getAngleFromCommand(_this.command);
                if (!_this.locked) {
                    _this.lock();
                    // helper.logger.debug(`${_this.name} STARTED CMD ${cmd}`);
                    // IMPORTANT: 9 is the REAL WORLD MOTOR MIN STEP 0x14 -> 0x15 == 9 degress
                    helper.preciseSetTimeout(_this.getSteps(cmd), _this.getFPS(), function(count) {
                        if (_this.newAngle > _this.currentAngle) {
                            _this.currentAngle += 9;
                        } else if (_this.newAngle < _this.currentAngle) {
                            _this.currentAngle -= 9;
                        }
                    }, function() {
                        _this.unlock();
                        //helper.logger.debug(`${_this.name} FINISHED CMD ${cmd}`);
                    });
                } else {
                    helper.logger.debug(`${_this.name} BUSY`);
                }
            } else {
                //helper.logger.debug(`${_this.name} SAME COMMAND AS ATUAL COMMAND`);
            }
        } else {
            if (cmd >= 0xFB && cmd <= 0xFF) {
                if (cmd == 0xFB) {
                    _this.command = 0xFB;
                    helper.logger.debug(`${_this.name} HALT ${cmd}`);
                } else if (cmd == 0xFD) {
                    _this.command = 0xFD;
                    helper.logger.debug(`${_this.name} SET CURRENT ZERO ${cmd}`);
                } else if (cmd == 0xFC) {
                    _this.command = 0xFC;
                    helper.logger.debug(`${_this.name} RESET ${cmd}`);
                } else if (cmd == 0xFE) {
                    _this.command = 0xFE;
                    helper.logger.debug(`${_this.name} CALIBRATE ${cmd}`);
                } else if (cmd == 0xFF) {
                    _this.command = 0xFF;
                    helper.logger.debug(`${_this.name} DISABLE ${cmd}`);
                }
            }
        }
        _this.command = cmd;
    }
}
