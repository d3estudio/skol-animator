// main functions
var helper = require('../lib/shared');

//libs
var Alphabet = require('../lib/alphabet');

module.exports = function ScoreBoard(message, where, loop) {
    var _this = this;
    _this.TIMERS = [];
    _this.name = 'ScoreBoardAnimation';
    _this.where = where;
    _this.message = [
        new Alphabet(message.country1 + '--'),
        new Alphabet(message.score1 + '--'),
        new Alphabet(message.country2 + '--'),
        new Alphabet(message.score2 + '--')
    ];
    _this.currentCol = 0;
    _this.running = false;
    _this.loop = loop;
    _this.draw = function() {
        var shift = 0;
        if (_this.message.length > 0) {
            var letterList = _this.message[0].textToBin();
            //_this.currentCol = parseInt(7 - (_this.message[0].size / 2));
            _this.currentCol = 0;
            if (_this.currentCol < 0) {
                _this.currentCol = 0;
            }
            letterList.forEach((letter, letterIndex) => {
                letter.forEach((line, lineIndex) => {
                    line.forEach((dot, dotIndex) => {
                        var x = _this.currentCol + dotIndex + shift,
                            y = lineIndex;
                        [_this.where[0], _this.where[1], _this.where[2]].forEach((wall, wallIndex) => {
                            if (wall.name == 'front') {
                                x = _this.currentCol + dotIndex + shift - 1;
                            }
                            if (wall.name == 'left') {
                                x = _this.currentCol + dotIndex + shift;
                            }
                            wall.motors.forEach((motor) => {
                                if (motor.x == (x + wall.offset) && motor.y == y) {
                                    if (dot) {
                                        motor.sendCommand(0x28);
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
            var steps = 40; // 1 step is 9deg // 3000 is an animation delay after roration
            var TMP_TIMER = setTimeout(() => {
                _this.draw()
            }, (_this.where[0].motors[0].getFPS() * steps) + 3000);
            _this.TIMERS.push(TMP_TIMER);
        } else {
            if (_this.loop) {
                _this.currentCol = 0;
                _this.message = [
                    new Alphabet(message.country1 + '--'),
                    new Alphabet(message.score1 + '--'),
                    new Alphabet(message.country2 + '--'),
                    new Alphabet(message.score2 + '--')
                ];
                var TMP_TIMER = setTimeout(_this.draw, 0);
                _this.TIMERS.push(TMP_TIMER);
            } else {
                [_this.where[0], _this.where[1], _this.where[2]].forEach((wall, wallIndex) => {
                    wall.motors.forEach((motor) => {
                        motor.sendCommand(0x14);
                    });
                });
                _this.running = false;
                helper.logger.debug(`${_this.name} FINISHED (waiting last command)`);
            }
        }
    }
    _this.init = () => {
        if (!_this.running) {
            _this.running = true;
            _this.draw();
            helper.logger.debug(`${_this.name} STARTED`);
        } else {
            helper.logger.debug(`${_this.name} already RUNNING`);
        }
    }
}
