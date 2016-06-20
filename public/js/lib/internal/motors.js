var Motor = function(x, y, color, parent, id) {
    var _this = this;

    //index on the matrix
    _this.x = x;
    _this.y = y;

    //where this motor is hold
    _this.parent = $(parent);

    //motor ID
    _this.id = id;

    //motor status
    _this.locked = false;

    //motor current angle
    _this.angle = 0;
    _this.virtualAngle = 0;
    _this.lastVirtualAngle = 0;

    //motor acceleration mode, and 360 degress rotation time to sync with the real world
    _this.speed = 0;
    _this.SPEED_TIME = 2.6;
    _this.SLOW__TIME = 5.2;

    //motor current applied command
    _this.command = 0x14;

    //timer to runUpdates on the virtualMotor
    _this.virtualTimer = null;
    _this.FPS = 50;

    //motor simulation representation
    _this.body = $('<div class="block"></div>');
    _this.hole = $('<div class="hole"></div>');
    _this.circle = $('<div class="circle"></div>');
    _this.mirror = $('<div class="mirror"><div class="line"></div></div>');

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
        }, _this.FPS);
    }

    //restart this motor
    _this.create = function() {
        _this.body.css({
            background: 'none'
        });
        clearInterval(_this.virtualTimer);
        _this.init();
    }

    //remove this motor from preview
    _this.destroy = function() {
        _this.body.html('');
        _this.body.css({
            background: color
        });
        clearInterval(_this.virtualTimer);
    }

    //lock this motor to wait the current command
    _this.lock = function() {
        _this.locked = true;
    }

    //unlock this motor and allow another command
    _this.unlock = function() {
        _this.locked = false;
    }

    //compute the real time angle of the motor to show the mirror
    _this.computeAngle = function() {
        var matrix = _this.circle.css('-moz-transform');
        if (matrix != 'none') {
            // do some magic
            var transform = matrix.split(' ');
            if (transform[6]) {
                var x = transform[6].split(",")[0];
                if (x) {
                    _this.virtualAngle = Math.round(Math.asin(x) * (180 / Math.PI));
                }
            }
        }
        if (_this.virtualAngle != _this.lastVirtualAngle) {
            if (_this.virtualAngle > 0 && _this.virtualAngle > _this.lastVirtualAngle) {
                _this.mirror.css({
                    opacity: 0
                });
            } else if (_this.virtualAngle > 0 && _this.virtualAngle < _this.lastVirtualAngle) {
                _this.mirror.css({
                    opacity: 1
                });
            } else if (_this.virtualAngle < 0 && _this.virtualAngle > _this.lastVirtualAngle) {
                _this.mirror.css({
                    opacity: 0
                });
            } else if (_this.virtualAngle < 0 && _this.virtualAngle < _this.lastVirtualAngle) {
                _this.mirror.css({
                    opacity: 1
                });
            }
        }
        _this.lastVirtualAngle = _this.virtualAngle;
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
    _this.animateToAngleWithTime = function(angle, time) {
        _this.circle.css({
            'transform': 'rotateX(' + angle + 'deg)',
            'transition': time + 's linear'
        })
        console.log(angle, time);
    }

    //send a command to rotate the motor according to the following table:
    _this.sendCommand = function(cmd) {
        if (cmd <= 0xF0) {
            var newAngle = _this.getAngleFromCommand(cmd),
                currentAngle = _this.getAngleFromCommand(_this.command),
                angle,
                time;
            if (cmd > _this.command) {
                angle = newAngle - currentAngle;
            } else if (cmd < _this.command) {
                angle = currentAngle - newAngle;
            } else {
                angle = newAngle - currentAngle;
            }
            if (_this.speed) {
                time = Math.abs(parseFloat((angle / 360) * _this.SPEED_TIME));
            } else {
                time = Math.abs(parseFloat((angle / 360) * _this.SLOW__TIME));
            }
            _this.animateToAngleWithTime(newAngle, time);
        } else {

        }
        _this.command = cmd;
    }

    /* this will be deprecated and must be deleted */
    _this.setAnimation = function(animation) {
        _this.body.addClass(animation);
    }
    _this.removeAnimation = function(animation) {
        _this.body.removeClass(animation);
    }
}
