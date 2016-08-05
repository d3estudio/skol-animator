// main functions
var helper = require('../lib/shared');

module.exports = function Lidar(where) {
    this.name = 'Lidar';
    this.where = where;
    this.right = where[0];
    this.front = where[1];
    this.left = where[2];
    this.roof = where[3];
    this.levels = {};
    this.currentLevel = 1;
    this.enabled = false;

    this.openLevel = (level) => {
        level = Math.abs(level - 4);
        if(level < 0 || level > 4) {
            helper.logger.debug(`${this.name}: Received invalid openLevel call for level ${level}`);
            return;
        }
        var targets = this.levels[level];
        if(level === 0) {
            // Open roof as well!
            targets = targets.concat(this.roof.motors);
        }
        if(this.enabled) {
            targets.forEach(m => m.sendCommand(0x1E));
        }
    }

    this.prepare = () => {
        this.where
            .concat((a, b) => a.concat(b.motors), [])
            .forEach(m => m.sendCommand(0x28));
    }

    this.setEnabled = (value) => {
        if(this.enabled == value) {
            return;
        } else {
            this.enabled = value;
        }
    };

    this.setLevel = (value) => {
        for(var i = 0; i < Math.min(0, Math.abs(this.currentLevel - value)); i++) {
            this.openLevel(i);
            this.currentLevel = i;
        };
    };

    this.draw = () => {
        helper.logger.debug(`${this.name} Opening level 0`);
        this.openLevel(0);
        var l = 1;
        var next = () => {
            this.openLevel(l);
            l++;
            if(l <= 4) {
                helper.logger.debug(`${this.name} Scheduled open for level ${l} in 2000ms`);
                setTimeout(() => next(), 1000);
            } else {
                helper.logger.debug(`${this.name} Done.`);
            }
        }
        helper.logger.debug(`${this.name} Scheduled open for level ${l} in 2000ms`);
        setTimeout(() => next(), 1000);
    }

    this.init = () => {
        [this.right, this.left, this.front]
            .reduce((a, b) => a.concat(b.motors), [])
            .forEach(m => {
                if(!this.levels.hasOwnProperty(m.y)) {
                    this.levels[m.y] = [];
                }
                this.levels[m.y].push(m);
            });
        this.prepare();
        setTimeout(() => this.draw(), 4000);
    }
};
