//main functions
var helper = require('./lib/Shared');
var Wall = require('./lib/Wall');

//libs
var ioc = require('socket.io-client');
var socket = ioc.connect('http://localhost:3000');

//animations
var ScrollText = require('./animations/ScrollText');
var ScoreBoard = require('./animations/ScoreBoard');
var Ola = require('./animations/Ola');
var Music = require('./animations/Music');
var Idle = require('./animations/Idle');

//walls with motors
var roof = new Wall(374, 11, 'top', 0, socket),
    leftWall = new Wall(170, 34, 'left', 4, socket),
    frontWall = new Wall(55, 11, 'front', 0, socket),
    rightWall = new Wall(170, 34, 'right', 0, socket);
roof.init();
leftWall.init();
frontWall.init();
rightWall.init();

//all animations
var currentAnimations = [];

//init socket
socket.on('connect', () => {
        helper.logger.debug('[Processor] Connected to port 3000');
    })
    .on('exec', (command) => {
        helper.logger.debug(`[Processor] Received Command ${command.animation}`);
        var animation = '';
        if (command.animation == 'ScrollText') {
            animation = new ScrollText(command.message, 13, [rightWall, frontWall, leftWall, roof], command.continuous, command.loop);
            animation.init();
        } else if (command.animation == 'ScoreBoard') {
            animation = new ScoreBoard({
                country1: command.country1,
                score1: command.score1,
                country2: command.country2,
                score2: command.score2
            }, [rightWall, frontWall, leftWall, roof], command.loop);
            animation.init();
        } else if (command.animation == 'Ola') {
            animation = new Ola(command.type, 13, [rightWall, frontWall, leftWall, roof], command.loop);
            animation.init();
        } else if (command.animation == 'Music') {
            animation = new Music(command.type, 13, [rightWall, frontWall, leftWall, roof]);
            animation.init();
        } else if (command.animation == 'Idle') {
            animation = new Idle(command.type, 18, [rightWall, frontWall, leftWall, roof], command.loop);
            idle.init();
        } else {
            if (command >= 0xFB && command <= 0xFF) {
                [rightWall, frontWall, leftWall, roof].forEach((wall) => {
                    wall.motors.forEach((motor) => {
                        motor.sendCommand(command);
                    })
                    wall.locked = false;
                });
            }
        }
        if (animation && animation.name) {
            currentAnimations.push(animation);
        }
    })
    .on('freeze', () => {
        var noop = () => {};
        currentAnimations.forEach((animation) => {
            Object.keys(animation).forEach((key) => animation[key] = noop);
            animation = null;
        });
        currentAnimations = [];
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
