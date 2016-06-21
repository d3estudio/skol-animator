//3D ambient
var ambient = new Ambient(document.body, {x:750, y:375, z:-1200, distance: 45}, window.innerWidth, window.innerHeight);
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

//fun goes here
var scroll = new ScrollText('SKOL', 13, 5, [leftWall, rightWall], false);
scroll.init();
