var scene;
var camera;
var controls;
var renderer;
var css_renderer;

init_ambient();
animate_ambient();

function init_ambient() {
    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    //                  hor, ver, zoom (0 is center)
    camera.position.set(500/2, 375, -1200);

    //controls
    controls = new THREE.OrbitControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    //WebGL Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setClearColor(0xffffff, 1)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.zIndex = 5;
    document.body.appendChild(renderer.domElement);

    //CSS3D Scene
    scene = new THREE.Scene();

    //HTML
    element = document.createElement('div');
    element.className = 'top';
    element.setAttribute("style", "width:440px;height:1360px");

    //CSS Object
    roof = new THREE.CSS3DObject(element);
    roof.position.x = 0;
    roof.position.y = 300;
    roof.rotation.x = Math.PI / 2;
    roof.rotation.y = Math.PI;
    scene.add(roof);

    //HTML
    element = document.createElement('div');
    element.className = 'left';
    element.setAttribute("style", "width:1360px;height:200px");

    //CSS Object
    left = new THREE.CSS3DObject(element);
    left.position.x = 220;
    left.position.y = 200;
    left.position.z = 0;
    left.rotation.x = Math.PI;
    left.rotation.y = Math.PI / 2;
    left.rotation.z = Math.PI;
    scene.add(left);

    //HTML
    element = document.createElement('div');
    element.className = 'right';
    element.setAttribute("style", "width:1360px;height:200px");

    //CSS Object
    right = new THREE.CSS3DObject(element);
    right.position.x = -220;
    right.position.y = 200;
    right.position.z = 0;
    right.rotation.x = Math.PI;
    right.rotation.y = -Math.PI / 2;
    right.rotation.z = Math.PI;
    scene.add(right);

    element = document.createElement('div');
    element.className = 'front';
    element.setAttribute("style", "width:440px;height:200px");

    //CSS Object
    front = new THREE.CSS3DObject(element);
    front.position.x = 0;
    front.position.y = 200;
    front.position.z = -680;
    front.rotation.x = Math.PI;
    front.rotation.z = Math.PI;
    scene.add(front);

    element = document.createElement('div');
    element.className = 'floor';
    element.setAttribute("style", "width:640px;height:1560px");

    //CSS Object
    floor = new THREE.CSS3DObject(element);
    floor.position.x = 0;
    floor.position.y = -100;
    floor.position.z = 0;
    floor.rotation.x = Math.PI / 2;
    floor.rotation.y = Math.PI;
    scene.add(floor);

    //CSS3D Renderer
    css_renderer = new THREE.CSS3DRenderer();
    css_renderer.setSize(window.innerWidth, window.innerHeight);
    css_renderer.domElement.style.position = 'absolute';
    css_renderer.domElement.style.top = 0;
    document.body.appendChild(css_renderer.domElement);
}

function animate_ambient() {
    requestAnimationFrame(animate_ambient);
    css_renderer.render(scene, camera);
    renderer.render(scene, camera);
    controls.update();
}
