var helper = require('../lib/shared');

module.exports = function Shot(where) {
    this.name = 'Shot';
    this.where = where;
    this.right = where[0];
    this.front = where[1];
    this.left = where[2];
    this.roof = where[3];
    this.tuples = {};
    this.timeout = this.where[0].motors[0].getFPS() * 10;
    this.scheduleNextIteration = (func) => {
        var time = this.timeout *= (this.returning ? 1.11111111 : 0.9);
        setTimeout(func, time);
    };
    this.draw = () => {
        var i = 0;
        var nextRoof = () => {
            var m = this.tuples[i++];
            if(m) {
                m.forEach(m => m.sendCommand(0x1E));
            };
            if(i != 17) {
                this.scheduleNextIteration(() => nextRoof());
            } else if(i == 7) {
                crawn
            }
        }
        nextRoof();
    };

    this.init = () => {
        var data = this.roof.motors.filter(m => m.x > 3 && m.x < 7);
        data.forEach(m => {
            if(!this.tuples.hasOwnProperty(m.y)) {
                this.tuples[m.y] = [];
            }
            this.tuples[m.y].push(m)
        });
        helper.logger.debug(`${this.name} STARTED`);
        helper.logger.debug(Object.keys(this.tuples));
        this.draw();
    }
};
