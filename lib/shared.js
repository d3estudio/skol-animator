var config = require('../settings.json'),
    log4js = require('log4js').getLogger(),
    fs = require('fs');

module.exports = {
    logger: {
        debug: (log) => {
            log4js.debug(log);
        },
        error: (log) => {
            log4js.error(log);
        }
    },
    // steps -> how many times to call
    // speed -> the FPS
    preciseSetTimeout: (steps, speed, oninstance, oncomplete) => {
        var count = 0,
            start = new Date().getTime();

        function loop() {
            if (count++ >= steps) {
                oncomplete()
            } else {
                oninstance(count);
                var diff = (new Date().getTime() - start) - (count * speed);
                setTimeout(loop, (speed - diff));
            }
        }
        setTimeout(loop, speed);
    },
    quatInverse: (q) => {
        var len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
        return {
            w: q.w / len,
            x: -q.x / len,
            y: -q.y / len,
            z: -q.z / len
        };
    },
    clearTimers: (animation) => {
        var noop = () => {};
        Object.keys(animation).forEach((key) => {
            if (key == 'TIMERS' && Array.isArray(animation[key])) {
                animation[key].forEach((timer) => {
                    clearTimeout(timer);
                });
            }
            animation[key] = noop;
        });
        animation = null;
    }
}
