//menu controllers
var ContextMenu = function() {
    var _this = this;
    this.message = 'SKOL';
    this.continuous = false;
    this.START = function() {
        var scroll = new ScrollText(_this.message, 13, 5, [leftWall, rightWall], _this.continuous);
        scroll.init();
    };
};
var options = new ContextMenu();
var gui = new dat.GUI();
gui.add(options, 'message');
gui.add(options, 'continuous');
gui.add(options, 'START');

//3D ambient
var ambient = new Ambient(document.body, {
    x: 750*-1,
    y: 375,
    z: -1200,
    distance: 45
}, window.innerWidth, window.innerHeight);
ambient.init();
ambient.animate();

//walls with motors
var roof = new Wall(374, 11, 'top', 0),
    leftWall = new Wall(170, 34, 'left', 21),
    frontWall = new Wall(55, 11, 'front', 0),
    rightWall = new Wall(170, 34, 'right', 0);
roof.init();
leftWall.init();
frontWall.init();
rightWall.init();
