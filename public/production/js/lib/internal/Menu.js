var gui = new dat.GUI();

//SCROLL TEXT
var ContextMenuScrollText = function() {
    var _this = this;
    this.message = 'SKOL';
    this.continuous = false;
    this.loop = false;
    this.START = function() {
        if (_this.message.length > 0) {
            socket.emit('animation', {
                animation: 'ScrollText',
                message: _this.message,
                continuous: _this.continuous,
                loop: _this.loop
            });
        } else {
            window.alert('Type a message!');
        }
    };
};
var optionsScrollText = new ContextMenuScrollText();

var scrollTextMenu = gui.addFolder('Scroll Text');
scrollTextMenu.add(optionsScrollText, 'message');
scrollTextMenu.add(optionsScrollText, 'continuous');
scrollTextMenu.add(optionsScrollText, 'loop');
scrollTextMenu.add(optionsScrollText, 'START');
scrollTextMenu.open();

//SCORE BOARD
var ContextMenuScoreBoard = function() {
    var _this = this;
    this.country1 = 'BRA';
    this.score1 = '0';
    this.country2 = 'USA';
    this.score2 = '0';
    this.loop = false;
    this.START = function() {
        if (_this.country1.length > 0 && _this.score1.length > 0 && _this.country2.length > 0 && _this.score2.length > 0) {
            socket.emit('animation', {
                animation: 'ScoreBoard',
                country1: _this.country1,
                score1: _this.score1,
                country2: _this.country2,
                score2: _this.score2,
                loop: _this.loop
            });
        } else {
            window.alert('We need two countries and two scores!');
        }
    };
};
var optionsScoreBoard = new ContextMenuScoreBoard();

var scoreBoardMenu = gui.addFolder('Score Board');
scoreBoardMenu.add(optionsScoreBoard, 'country1');
scoreBoardMenu.add(optionsScoreBoard, 'score1');
scoreBoardMenu.add(optionsScoreBoard, 'country2');
scoreBoardMenu.add(optionsScoreBoard, 'score2');
scoreBoardMenu.add(optionsScoreBoard, 'loop');
scoreBoardMenu.add(optionsScoreBoard, 'START');
scoreBoardMenu.open();

//OLA
var ContextMenuOla = function() {
    var _this = this;
    this.type = 'little';
    this.loop = false;
    this.START = function() {
        socket.emit('animation', {
            animation: 'Ola',
            type: _this.type,
            loop: _this.loop
        });
    };
};
var optionsOla = new ContextMenuOla();

var olaMenu = gui.addFolder('Ola');
olaMenu.add(optionsOla, 'type', {
    '45º short': 'little',
    '90º long': 'full'
});
olaMenu.add(optionsOla, 'loop');
olaMenu.add(optionsOla, 'START');
olaMenu.open();

//IDLE
var ContextMenuIdle = function() {
    var _this = this;
    this.type = 'shuffle';
    this.loop = false;
    this.START = function() {
        socket.emit('animation', {
            animation: 'Idle',
            type: _this.type,
            loop: _this.loop
        });
    };
};
var optionsIdle = new ContextMenuIdle();

var idleMenu = gui.addFolder('IDLE');
idleMenu.add(optionsIdle, 'type', {
    Randomized: 'shuffle',
    Live: 'live',
    Linear: 'open',
    Breathing: 'breathing',
    Spiral: 'spiral',
    Glass: 'glass'
});
idleMenu.add(optionsIdle, 'loop');
idleMenu.add(optionsIdle, 'START');
idleMenu.open();

//MUSIC
var ContextMenuMusic = function() {
    var _this = this;
    this.type = 'equalizer';
    this.START = function() {
        socket.emit('animation', {
            animation: 'Music',
            type: _this.type
        });
    };
};
var optionsMusic = new ContextMenuMusic();

var musicMenu = gui.addFolder('MUSIC');
musicMenu.add(optionsMusic, 'type', {
    'Equalizer': 'equalizer',
    //'BPM': 'bpm',
    '---------': '',
    'TooFast (~166bpm)': 'very_fast_boom',
    'Fastest (~120bpm)': 'fast_boom',
    'Slow (~65bpm)': 'boom',
    'Slower (~35bmp)': 'long_boom',
});
musicMenu.add(optionsMusic, 'START');
musicMenu.open();
