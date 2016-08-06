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
    this.currentLevel = 0;
    this.enabled = true;
    this.steps = 10;
    this.returning = false;

    [this.right, this.left, this.front]
        .reduce((a, b) => a.concat(b.motors), [])
        .forEach(m => {
            if(!this.levels.hasOwnProperty(m.y)) {
                this.levels[m.y] = [];
            }
            this.levels[m.y].push(m);
        });

    this.openLevel = (level) => {
        console.log('openLevel::' + level);
        level = Math.abs(level - 4);
        if(level < 0 || level > 4) {
            helper.logger.debug(`${this.name}: Received invalid openLevel call for level ${level}`);
            return;
        }
        var targets = this.levels[level];
        if(level === 0) {
            // Open roof as well!
            targets = targets.concat(this.roof.motors);
            setTimeout(() => this.performOla(), 2000);
        }
        if(this.enabled) {
            targets.forEach(m => m.sendCommand(0x14));
        }
    }

    this.prepare = () => {
        this.where
            .reduce((a, b) => a.concat(b.motors), [])
            .forEach(m => m.sendCommand(0x28));
        setTimeout(() => this.openLevel(0), 3000);
    }

    this.setEnabled = (value) => {
        if(this.enabled == value) {
            return;
        } else {
            this.enabled = value;
        }
    };

    this.setLevel = (value) => {
        helper.logger.debug(`${this.name} Setting level to ${value}`);
        for(var i = 1; i < Math.min(5, value); i++) {
            if(this.currentLevel >= i) {
                console.log('skipped level ' + i);
                continue;
            }
            console.log('accepted level ' + i)
            this.openLevel(i);
            this.currentLevel = i;
        }
    };

    this.performOla = () => {
        this.yStep = 5;
        this.roofAStep = 0;
        this.roofBStep = 11;
        this.timeout = this.where[0].motors[0].getFPS() * 10;
        var sideMotors = [this.right, this.front, this.left].reduce((a, b) => a.concat(b.motors), []);
        this.getTimeout = (func) => {
            var time = this.timeout *= (this.returning ? 1.11111111 : 0.9);
            setTimeout(func, time);
        };

        var sidesStep = () => {
            var step = --this.yStep;
            helper.logger.debug(`${this.name} Performing side step ${step}, returning: ${this.returning}`);
            sideMotors
                .filter(m => m.y == step)
                .forEach(m => m.sendCommand(m.command === 0x14 ? 0x3C : 0x14));
            if(this.yStep > 0) {
                helper.logger.debug(`${this.name}::SideStep Scheduling sideStep.`);
                this.getTimeout(() => sidesStep());
            } else {
                helper.logger.debug(`${this.name}::SideStep Scheduling roofStep.`);
                this.getTimeout(() => roofSteps());
            }
        };

        var roofSteps = () => {
            var aStep = this.roofAStep++;
            var bStep = this.roofBStep--;
            if(bStep >= 6) {
                this.roof.motors
                    .filter(m => m.x == aStep || m.x == bStep)
                    .forEach(m => m.sendCommand(m.command === 0x14 ? 0x3C : 0x14));
            }
            if(bStep > 5) {
                helper.logger.debug(`${this.name}::RoofStep Scheduling roofStep (${aStep}, ${bStep})`);
                this.getTimeout(() => roofSteps());
            }
            if(bStep === 5 && !this.returning) {
                helper.logger.debug(`${this.name}::RoofStep Resetting variables and returning`);
                this.returning = true;
                this.yStep = 5;
                this.roofAStep = 0;
                this.roofBStep = 11;
                helper.logger.debug(`${this.name}::RoofStep Scheduling sidesStep`);
                setTimeout(() => sidesStep(), 40 * where[0].motors[0].getFPS() + 200);
            } else if(bStep === 5 && this.returning) {
                helper.logger.debug(`${this.name}::RsoofStep Resetting return state`);
                this.returning = false;
                this.yStep = 5;
                this.roofAStep = 0;
                this.roofBStep = 11;
                if(this.loop) {
                    setTimeout(() => sidesStep(), 40 * where[0].motors[0].getFPS() + 200);
                }
                helper.logger.debug(`${this.name}::RoofStep Done.`);
            }
        };
        sidesStep();
    }

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
        this.prepare();
        setTimeout(() => this.draw(), 4000);
    }
};
