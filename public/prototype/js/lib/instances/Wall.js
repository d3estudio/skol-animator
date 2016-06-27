//creates a wall of motors
var Wall = function(size, width, className, offset) {
    var _this = this;
    _this.name = className;
    _this.size = parseInt(size);
    _this.width = parseInt(width);
    _this.globalID = 0;
    _this.created = false;
    _this.motors = [];
    _this.offset = offset;
    _this.init = function() {
        if (!_this.created) {
            for (var i = 0; i < _this.size; i++) {
                var y = parseInt(i / _this.width),
                    x = parseInt(i - (_this.width * y)),
                    color = new Color(_this.name, i),
                    motor = new Motor(x, y, color.getColor(), '.' + _this.name, _this.globalID++);
                motor.init();

                if (y < 23 && _this.name == 'top') {
                    if (y == 22 && (x == 0 || x == 2 || x == 4 || x == 5 || x == 6 || x == 8 || x == 9 || x == 10)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (y == 21 && (x == 0 || x == 1 || x == 3 || x == 6 || x == 7 || x == 10)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (y == 20 && (x == 2 || x == 3 || x == 5 || x == 7 || x == 10)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (y == 19 && (x == 1 || x == 6 || x == 7 || x == 9)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (y == 18 && (x == 0 || x == 4 || x == 6)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (y == 17 && x == 3) {
                        motor.create();
                        _this.motors.push(motor);
                    } else {
                        motor.destroy();
                    }
                } else if (x < 21 && _this.name == 'left') {
                    if (x == 20 && (y == 1 || y == 3)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (x == 19 && (y == 1 || y == 4)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (x == 18 && (y == 0 || y == 3)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (x == 17 && y == 1) {
                        motor.create();
                        _this.motors.push(motor);
                    } else {
                        motor.destroy();
                    }
                } else if (x > 12 && _this.name == 'right') {
                    if (x == 13 && (y == 0 || y == 1)) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (x == 14 && y == 2) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (x == 15 && y == 1) {
                        motor.create();
                        _this.motors.push(motor);
                    } else if (x == 16 && y == 3) {
                        motor.create();
                        _this.motors.push(motor);
                    } else {
                        motor.destroy();
                    }
                } else {
                    motor.create();
                    _this.motors.push(motor);
                }
            }
            console.warn('WALL', _this.name, 'CREATED');
            $('.block').css({
                width: 40,
                height: 40
            });
            _this.created = true;
        } else {
            console.warn('WALL', _this.name, 'EXISTS');
        }
    }
}
