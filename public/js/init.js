//3D ambient
var ambient = new Ambient(document.body, {
    x: 750 * -1,
    y: 375 * 2,
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
