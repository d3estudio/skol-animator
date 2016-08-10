var helper = require('../lib/shared');

function Line(y) {
    this.y = y;
    this.motors = [];
    this.active = false;
    this.xCounter = 44;
    this.interval = setInterval(() => this.tick(), 75);
    this.nextLoop = 0;
    this.safeStopAt = Date.now();
}

Line.prototype = {
    destroy: function() {
        clearInterval(this.interval);
    },
    reset: function() {
        this.active = false;
        this.xCounter = 44;
        setTimeout(() => {
            this.motors.forEach(m => m.sendCommand(0x14));
        }, Date.now() - this.safeStopAt);
    },
    tick: function() {
        this.safeStopAt = Date.now() + 2000;
        if(this.active && Date.now() > this.nextLoop) {
            this.motors.forEach((motor, motorIndex) => {
                if (this.xCounter > 26 && motor.parent == 'right') {
                    if (motor.x == this.xCounter - 27) {
                        motor.sendCommand(motor.command === 0x14 ? 0x3C : 0x14);
                    }
                } else if (this.xCounter > 15 && motor.parent == 'front') {
                    if (motor.x == this.xCounter - 16) {
                        motor.sendCommand(motor.command === 0x14 ? 0x3C : 0x14);
                    }
                } else if (this.xCounter > -1 && motor.parent == 'left') {
                    if (motor.x == this.xCounter - 1) {
                        motor.sendCommand(motor.command === 0x14 ? 0x3C : 0x14);
                    }
                }
            });
            this.xCounter--;
            if(this.xCounter == -1) {
                this.xCounter = 44;
                this.nextLoop = Date.now() + 2000;
            }
        }
    }
};



function Lidar(where) {
    this.name = 'Lidar';
    this.where = where;
    this.right = where[0];
    this.front = where[1];
    this.left = where[2];
    this.roof = where[3];
    this.lines = {};
    this.enabled = false;
    this.steps = 10;
    this.returning = false;

    [this.right, this.left, this.front]
        .reduce((a, b) => a.concat(b.motors), [])
        .forEach(m => {
            if(!this.lines.hasOwnProperty(m.y)) {
                this.lines[m.y] = new Line(m.y);
            }
            this.lines[m.y].motors.push(m);
        });

    this.debug = function() {
        if(this.enabled) {
            helper.logger.debug.apply(helper.logger, arguments);
        }
    },

    this.prepare = () => {
        this.currentLevel = 0;
        this.returning = false;
        this.where
            .reduce((a, b) => a.concat(b.motors), [])
            .forEach(m => m.sendCommand(0x28));
        setTimeout(() => this.openLevel(0), 3000);
    }

    this.setEnabled = (value) => {
        if(this.enabled != value) {
            this.enabled = value;
            if(this.enabled) {
                this.prepare();
            } else {
                this.drop();
            }
        }
    }

    this.openLevel = (level) => {
        level = Math.abs(level - 4);
        if(level < 0 || level > 4) {
            return;
        }
        this.lines[level].active = true;
        if(level == 0) {
            var drift = 200;
            Object.keys(this.lines)
                .forEach(k => {
                    setTimeout(() => this.lines[k].reset(), drift);
                    drift += 300;
                });
            this.roof.motors.forEach(m => m.sendCommand(0x14));
            setTimeout(() => this.performOla(), 6000 + drift);
        }
    }

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
            this.debug(`${this.name} Performing side step ${step}, returning: ${this.returning}`);
            sideMotors
                .filter(m => m.y == step)
                .forEach(m => m.sendCommand(m.command === 0x14 ? 0x3C : 0x14));
            if(this.yStep > 0) {
                this.debug(`${this.name}::SideStep Scheduling sideStep.`);
                this.getTimeout(() => sidesStep());
            } else {
                this.debug(`${this.name}::SideStep Scheduling roofStep.`);
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
                this.debug(`${this.name}::RoofStep Scheduling roofStep (${aStep}, ${bStep})`);
                this.getTimeout(() => roofSteps());
            }
            if(bStep === 5 && !this.returning) {
                this.debug(`${this.name}::RoofStep Resetting variables and returning`);
                this.returning = true;
                this.yStep = 5;
                this.roofAStep = 0;
                this.roofBStep = 11;
                this.debug(`${this.name}::RoofStep Scheduling sidesStep`);
                setTimeout(() => sidesStep(), 40 * where[0].motors[0].getFPS() + 200);
            } else if(bStep === 5 && this.returning) {
                this.debug(`${this.name}::RoofStep Resetting return state`);
                this.returning = false;
                this.yStep = 5;
                this.roofAStep = 0;
                this.roofBStep = 11;
                if(this.loop) {
                    setTimeout(() => sidesStep(), 40 * where[0].motors[0].getFPS() + 200);
                }
                this.debug(`${this.name}::RoofStep Done.`);
            }
        };
        sidesStep();
    }
}

module.exports = Lidar;
