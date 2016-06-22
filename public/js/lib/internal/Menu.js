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

var scrollText = gui.addFolder('Scroll Text');
scrollText.add(optionsScrollText, 'message');
scrollText.add(optionsScrollText, 'continuous');
scrollText.add(optionsScrollText, 'loop');
scrollText.add(optionsScrollText, 'START');
scrollText.open();

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
            }, 13, 5, [rightWall, frontWall, leftWall, roof],_this.loop);
            scroll.init();
        } else {
            window.alert('We need two countries and two scores!');
        }
    };
};
var optionsScoreBoard = new ContextMenuScoreBoard();

var scoreBoard = gui.addFolder('Score Board');
scoreBoard.add(optionsScoreBoard, 'country1');
scoreBoard.add(optionsScoreBoard, 'score1');
scoreBoard.add(optionsScoreBoard, 'country2');
scoreBoard.add(optionsScoreBoard, 'score2');
scoreBoard.add(optionsScoreBoard, 'loop');
scoreBoard.add(optionsScoreBoard, 'START');
scoreBoard.open();
