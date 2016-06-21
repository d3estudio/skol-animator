var ScrollText = function(message, width, height, where, overflow) {
    var _this = this;
    _this.name = 'ScrollTextAnimation';
    _this.width = parseInt(width);
    _this.height = parseInt(height);
    _this.where = where;
    _this.message = new Alphabet(message);
    _this.currentCol = _this.width - 1;
    _this.running = false;
    _this.overflow = overflow;

    _this.finish = function() {
        _this.where.forEach(function(wall, wallIndex) {
            wall.motors.forEach(function(motor) {
                bit.sendCommand(0x14);
            });
            console.info(_this.name, _this.message, 'FINISHED (waiting)');
        });
    }
    _this.moveLetters = function() {
        var shift = 0;
        var letterList = _this.message.textToBin();
        letterList.forEach(function(letter, letterIndex) {
            letter.forEach(function(line, lineIndex) {
                line.forEach(function(dot, dotIndex) {
                    var x = _this.currentCol + dotIndex + shift,
                        y = lineIndex,
                        bit;
                    _this.where.forEach(function(wall, wallIndex) {
                        wall.motors.forEach(function(motor) {
                            if (motor.x == (x+wall.offset) && motor.y == y) {
                                bit = motor;
                                if (dot) {
                                    bit.sendCommand(0x1E);
                                } else {
                                    bit.sendCommand(0x14);
                                }
                            }
                        });
                    });
                })
            });
            shift += letter[0].length;
        });
    }
    _this.draw = function() {
        setTimeout(function() {
            if (_this.overflow) {
                if (_this.currentCol > _this.message.size*-1) {
                    _this.moveLetters(_this.currentCol);
                    _this.currentCol--;
                    requestAnimationFrame(_this.draw);
                } else {
                    _this.finish();
                }
            } else {
                if (_this.currentCol > -1) {
                    _this.moveLetters(_this.currentCol);
                    _this.currentCol--;
                    requestAnimationFrame(_this.draw);
                } else {
                    _this.finish();
                }
            }
        }, _this.where[0].motors[0].getFPS()*20);
    }
    _this.init = function() {
        if (!_this.running) {
            _this.draw();
        } else {
            console.warn(_this.name, _this.message, 'already RUNNING');
        }
    }
}
