var Motor = function(x, y, color, parent, id) {
    var _this = this;

    //naming for LOGS
    _this.name = parent.toUpperCase().replace('.', '') + '_[' + x + '][' + y + ']';

    //index on the matrix
    _this.x = x;
    _this.y = y;

    //where this motor is hold
    _this.parent = $(parent);

    //parent name slug
    _this.parentName = parent.replace('.', '').toUpperCase();

    //motor ID
    _this.id = id;

    //motor status
    _this.locked = false;

    //motor current angle
    _this.angle = 0;

    //motor acceleration mode, and 360 degress rotation time to sync with the real world
    _this.speed = 1;
    _this.SPEED_TIME = 2.1 * 1000;
    _this.SLOW__TIME = 4.2 * 1000;

    //motor current applied command
    _this.command = 0x14;

    //timer to runUpdates on the virtualMotor
    _this.virtualTimer = null;

    //motor simulation representation
    _this.body = $('<div class="block" data-id="' + id + '" data-x="' + x + '" data-y="' + y + '"></div>');
    _this.hole = $('<div class="hole"></div>');
    _this.circle = $('<div class="circle"></div>');
    _this.mirror = $('<div class="mirror"><div class="line"></div></div>');

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

    //add this motor to the 3D preview
    _this.init = function() {
        _this.hole.css({
            'box-shadow': '0 0 0 99999px ' + color,
            '-webkit-box-shadow': '0 0 0 99999px ' + color,
            '-moz-box-shadow': '0 0 0 99999px ' + color
        });
        _this.circle.css({
            background: color
        });
        _this.parent.append(_this.body);
        _this.body.append(_this.hole).append(_this.circle);
        _this.circle.append(_this.mirror);

        _this.virtualTimer = setInterval(function() {
            _this.computeAngle();
        }, _this.getFPS);
        //console.info(_this.name, 'INITIATED');
    }

    //restart this motor
    _this.create = function() {
        _this.body.css({
            background: 'none'
        });
        clearInterval(_this.virtualTimer);
        _this.init();
        //console.info(_this.name, 'CREATED');
    }

    //remove this motor from preview
    _this.destroy = function() {
        _this.body.html('');
        _this.body.css({
            background: color
        });
        clearInterval(_this.virtualTimer);
        //console.info(_this.name, 'DESTROYED');
    }

    //lock this motor to wait the current command
    _this.lock = function() {
        _this.locked = true;
        //console.info(_this.name, 'LOCKED');
    }

    //unlock this motor and allow another command
    _this.unlock = function() {
        _this.locked = false;
        //console.info(_this.name, 'UNLOCKED');
    }

    //compute the real time angle of the motor to show the mirror
    _this.computeAngle = function() {
        if (_this.angle > 90 && _this.angle < 270) {
            _this.mirror.css({
                opacity: 1
            });
        } else {
            _this.mirror.css({
                opacity: 0
            });
        }
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

    //animate the motor respecting the limitations
    _this.animateToAngle = function(currentAngle, newAngle) {
        if (currentAngle == newAngle) {
            _this.unlock();
            var date = new Date();
            //console.info(_this.name, 'finidhed COMMAND at ', date, date.getMilliseconds(), 'with angle', currentAngle);
        } else {
            if (newAngle > currentAngle) {
                currentAngle += 9;
            } else {
                currentAngle -= 9;
            }
            setTimeout(function() {
                _this.animateToAngle(currentAngle, newAngle);
            }, _this.getFPS());
        }
        _this.circle.css({
            'transform': 'rotateX(' + currentAngle + 'deg)'
        });
        _this.angle = ((currentAngle % 360) + 360) % 360;
    }

    //send a command to rotate the motor according to the following table:
    _this.sendCommand = function(cmd) {
        if (cmd <= 0xF0) {
            var newAngle = _this.getAngleFromCommand(cmd),
                currentAngle = _this.getAngleFromCommand(_this.command),
                angle;
            if (cmd > _this.command) {
                angle = newAngle - currentAngle;
            } else if (cmd < _this.command) {
                angle = currentAngle - newAngle;
            } else {
                angle = newAngle - currentAngle;
            }
            if (!_this.locked) {
                _this.lock();
                var date = new Date();
                //console.info(_this.name, 'started COMMAND at ', date, date.getMilliseconds(), 'with angle', currentAngle);
                _this.animateToAngle(currentAngle, newAngle);
            } else {
                //console.warn(_this.name, 'BUSY');
            }
        } else {

        }
        _this.command = cmd;
    }
}
