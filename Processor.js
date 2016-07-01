//main functions
var helper = require('./lib/Shared');
var Wall = require('./lib/Wall');

//libs
var ioc = require('socket.io-client');
var socket = ioc.connect('http://localhost:3000');

//animations
var ScrollText = require('./animations/ScrollText');

//walls with motors
var roof = new Wall(374, 11, 'top', 0, socket),
    leftWall = new Wall(170, 34, 'left', 4, socket),
    frontWall = new Wall(55, 11, 'front', 0, socket),
    rightWall = new Wall(170, 34, 'right', 0, socket);
roof.init();
leftWall.init();
frontWall.init();
rightWall.init();

//init socket
socket.on('connect', () => {
        helper.logger.debug('[Processor] Connected to port 3000');
    })
    .on('exec', (command) => {
        helper.logger.debug(`[Processor] Received Command ${command.animation}`);
        if (command.animation == 'ScrollText') {
            var skol = new ScrollText(command.message, 13, [rightWall, frontWall, leftWall, roof], command.continuous, command.loop);
            skol.init();
        }
    })
    .on('disconnect', () => {
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
