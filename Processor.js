//main functions
var helper = require('./lib/Shared');
var Wall = require('./lib/Wall');

//libs
var ioc = require('socket.io-client');
var client = ioc.connect('http://localhost:3000');

//walls with motors
var roof = new Wall(374, 11, 'top', 0),
    leftWall = new Wall(170, 34, 'left', 21),
    frontWall = new Wall(55, 11, 'front', 0),
    rightWall = new Wall(170, 34, 'right', 0);
roof.init();
leftWall.init();
frontWall.init();
rightWall.init();

client.on('connect', function() {
        helper.logger.debug('[Processor] Connected to port 3000');
    })
    .on('disconnect', function() {
        helper.logger.debug('[Processor] Disconnected from port 3000');
    });

// MESSAGE TEMPLATE
// {
//     "d": "d3skol.router.map.in",
//     "s": "your.reply.to.channel.id.here",
//     "c": "FACE_BITMAP",
//     "p": ["{\"map\":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}"],
//     "a": 0,
//     "sq": 1
// }
