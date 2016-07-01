//main functions
var helper = require('./lib/Shared');
var Wall = require('./lib/Wall');

//libs
var ioc = require('socket.io-client');
var socket = ioc.connect('http://localhost:3000');

//animations
var ScrollText = require('./animations/ScrollText');

//init socket
socket.on('connect', function() {
        helper.logger.debug('[Processor] Connected to port 3000');
    })
    .on('disconnect', function() {
        helper.logger.debug('[Processor] Disconnected from port 3000');
    });

//walls with motors
var roof = new Wall(374, 11, 'top', socket),
    leftWall = new Wall(170, 34, 'left', socket),
    frontWall = new Wall(55, 11, 'front', socket),
    rightWall = new Wall(170, 34, 'right', socket);
roof.init();
leftWall.init();
frontWall.init();
rightWall.init();

var skol = new ScrollText('SKOL', 11, [rightWall, frontWall, leftWall, roof], false, false);
skol.init();









































// client.on('connect', function() {
//         helper.logger.debug('[Processor] Connected to port 3000');
//     })
//     .on('disconnect', function() {
//         helper.logger.debug('[Processor] Disconnected from port 3000');
//     });

// MESSAGE TEMPLATE
// {
//     "d": "d3skol.router.map.in",
//     "s": "your.reply.to.channel.id.here",
//     "c": "FACE_BITMAP",
//     "p": ["{\"map\":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}"],
//     "a": 0,
//     "sq": 1
// }
