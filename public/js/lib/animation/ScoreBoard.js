var ScoreBoard = function(message, width, height, where, loop) {
    var _this = this;
    _this.name = 'ScoreBoardAnimation';
    _this.width = parseInt(width);
    _this.height = parseInt(height);
    _this.where = where;
    _this.message = [
        new Alphabet(message.country1),
        new Alphabet('--' + message.score1 + '--'),
        new Alphabet(message.country2),
        new Alphabet('--' + message.score2 + '--')
    ];
    _this.currentCol = 0;
    _this.running = false;
    _this.loop = loop;
    _this.draw = function() {
        var shift = 0;
        if (_this.message.length > 0) {
            var letterList = _this.message[0].textToBin();
            _this.currentCol = parseInt(7 - (_this.message[0].size / 2));
            if (_this.currentCol < 0) {
                _this.currentCol = 0;
            }
            letterList.forEach(function(letter, letterIndex) {
                letter.forEach(function(line, lineIndex) {
                    line.forEach(function(dot, dotIndex) {
                        var x = _this.currentCol + dotIndex + shift,
                            y = lineIndex,
                            bit;
                        [_this.where[0], _this.where[1], _this.where[2]].forEach(function(wall, wallIndex) {
                            if (wall.name == 'front') {
                                x = _this.currentCol + dotIndex + shift - 1;
                            }
                            wall.motors.forEach(function(motor) {
                                if (motor.x == (x + wall.offset) && motor.y == y) {
                                    if (dot) {
                                        motor.sendCommand(0x1E);
                                    } else {
                                        motor.sendCommand(0x14);
                                    }
                                }
                            });
                        });
                    });
                });
                shift += letter[0].length;
            });
            _this.message.shift();
            var steps = 20; // 1 step is 9deg // 3000 is an animation delay after roration
            setTimeout(function() {
                requestAnimationFrame(_this.draw);
            }, (_this.where[0].motors[0].getFPS() * steps) + 3000);
        } else {
            if (_this.loop) {
                _this.currentCol = 0;
                _this.message = [
                    new Alphabet(message.country1),
                    new Alphabet('--' + message.score1 + '--'),
                    new Alphabet(message.country2),
                    new Alphabet('--' + message.score2 + '--')
                ];
                setTimeout(_this.draw, 0);
            } else {
                [_this.where[0], _this.where[1], _this.where[2]].forEach(function(wall, wallIndex) {
                    wall.motors.forEach(function(motor) {
                        motor.sendCommand(0x14);
                    });
                });
                console.info(_this.name, _this.message, 'FINISHED (waiting last command)');
            }
        }
    }
    _this.init = function() {
        if (!_this.running) {
            _this.draw();
        } else {
            console.warn(_this.name, _this.message, 'already RUNNING');
        }
    }
}
