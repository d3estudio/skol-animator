// main functions
var helper = require('../lib/shared');

module.exports = function VerticalOla(where) {
    this.name = 'VerticalOla';
    this.where = where;
    this.right = where[0];
    this.front = where[1];
    this.left = where[2];
    this.roof = where[3];
    this.steps = 10;
    this.returning = false;

    this.draw = () => {
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
                // this.getTimeout(() => sidesStep());
                setTimeout(() => sidesStep(), 40 * where[0].motors[0].getFPS() + 200);
            } else if(bStep === 5 && this.returning) {
                helper.logger.debug(`${this.name}::RoofStep Resetting return state`);
                this.returning = false;
                helper.logger.debug(`${this.name}::RoofStep Done.`);
            }
        };
        sidesStep();
        // this.where
        //     .reduce((a, b) => a.concat(b.motors), [])
        //     .forEach(motor => motor.sendCommand(20 + Math.floor(Math.random() * 20)));
        helper.logger.debug(`${this.name} almost FINISHED (waiting last command)`);
    }
    this.init = () => {
        this.draw();
        helper.logger.debug(`${this.name} STARTED`);
    }
}
