var gui = new dat.GUI();

//SCROLL TEXT
var ContextMenuScrollText = function() {
    var _this = this;
    this.message = 'SKOL';
    this.continuous = false;
    this.loop = false;
    this.START = function() {
        if (_this.message.length > 0) {
            var scroll = new ScrollText(_this.message, 13, 5, [rightWall, frontWall, leftWall, roof], _this.continuous, _this.loop);
            scroll.init();
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
    this.score1 = '1';
    this.country2 = 'USA';
    this.score2 = '0';
    this.loop = false;
    this.START = function() {
        if (_this.country1.length > 0 && _this.score1.length > 0 && _this.country2.length > 0 && _this.score2.length > 0) {
            var scroll = new ScoreBoard({
                country1: _this.country1,
                score1: _this.score1,
                country2: _this.country2,
                score2: _this.score2
            }, [rightWall, frontWall, leftWall, roof],_this.loop);
            scroll.init();
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
        var ola = new Ola(_this.type, 13, [rightWall, frontWall, leftWall, roof], _this.loop);
        ola.init();
    };
};
var optionsOla = new ContextMenuOla();

var olaMenu = gui.addFolder('Ola');
olaMenu.add(optionsOla, 'type', [ 'little', 'full' ]);
olaMenu.add(optionsOla, 'loop');
olaMenu.add(optionsOla, 'START');
olaMenu.open();

//OLA
var ContextMenuIdle = function() {
    var _this = this;
    this.type = 'shuffle';
    this.loop = false;
    this.START = function() {
        var idle = new Idle(_this.type, 18, [rightWall, frontWall, leftWall, roof], _this.loop);
        idle.init();
    };
};
var optionsIdle = new ContextMenuIdle();

var idleMenu = gui.addFolder('IDLE');
idleMenu.add(optionsIdle, 'type', [ 'shuffle', 'open' ]);
idleMenu.add(optionsIdle, 'loop');
idleMenu.add(optionsIdle, 'START');
idleMenu.open();
