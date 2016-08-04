// main functions
var helper = require('../lib/shared');

module.exports = function RandomPosition(where) {
    var _this = this;
    _this.name = 'RandomPosition';
    _this.where = where;
    _this.draw = () => {
        _this.where
            .reduce((a, b) => a.concat(b.motors), [])
            .forEach(motor => motor.sendCommand(20 + Math.floor(Math.random() * 20)));
        helper.logger.debug(`${_this.name} almost FINISHED (waiting last command)`);
    }
    _this.init = () => {
        _this.draw();
        helper.logger.debug(`${_this.name} STARTED`);
    }
}
