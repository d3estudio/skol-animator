//main functions
var helper = require('./lib/shared');

//libs
var Myo = require('myo');
var ioc = require('socket.io-client');
var socket = ioc.connect('http://localhost:3000');

Myo.connect('do.d3.skol');

Myo.on('connected', () => {
    helper.logger.debug('[Myo] Connected');
    Myo.setLockingPolicy('none');
});

Myo.on('pose', (pose) => {
    helper.logger.debug(`[MYO] ${pose}`);
    socket.emit('myo', {
        type: 'pose',
        pose: pose
    });
});

// Myo.on('orientation', (data) => {
//     // console.log('X', data.x.toFixed(5));
//     // console.log('Y', data.y.toFixed(5));
//     // console.log('Z', data.z.toFixed(5));
// });
