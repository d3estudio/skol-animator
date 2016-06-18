var camera;
var controls;
var scene;
var torus;
var light;
var renderer;
var scene2;
var renderer2;
var div;

init_ambient();
animate_ambient();

function init_ambient() {
    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500, 250, -1200);

    //controls
    controls = new THREE.OrbitControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    //Scene
    scene = new THREE.Scene();

    //HemisphereLight
    light = new THREE.HemisphereLight(0xffbf67, 0x15c6ff);
    scene.add(light);

    //WebGL Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xffffff, 1)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.zIndex = 5;
    document.body.appendChild(renderer.domElement);

    //CSS3D Scene
    scene2 = new THREE.Scene();

    //HTML
    element = document.createElement('div');
    element.className = 'top';
    element.setAttribute("style","width:440px;height:1360px");

    //CSS Object
    roof = new THREE.CSS3DObject(element);
    roof.position.x = 0;
    roof.position.y = 100;
    roof.rotation.x = Math.PI/2;
    roof.rotation.y = Math.PI;
    scene2.add(roof);

    //HTML
    element = document.createElement('div');
    element.className = 'left';
    element.setAttribute("style","width:1360px;height:200px");

    //CSS Object
    left = new THREE.CSS3DObject(element);
    left.position.x = 220;
    left.position.y = 0;
    left.position.z = 0;
    left.rotation.x = Math.PI;
    left.rotation.y = Math.PI/2;
    left.rotation.z = Math.PI;
    scene2.add(left);

    //HTML
    element = document.createElement('div');
    element.className = 'right';
    element.setAttribute("style","width:1360px;height:200px");

    //CSS Object
    right = new THREE.CSS3DObject(element);
    right.position.x = -220;
    right.position.y = 0;
    right.position.z = 0;
    right.rotation.x = Math.PI;
    right.rotation.y = -Math.PI/2;
    right.rotation.z = Math.PI;
    scene2.add(right);

    element = document.createElement('div');
    element.className = 'front';
    element.setAttribute("style","width:440px;height:200px");

    //CSS Object
    front = new THREE.CSS3DObject(element);
    front.position.x = 0;
    front.position.y = 0;
    front.position.z = -680;
    front.rotation.x = Math.PI;
    front.rotation.z = Math.PI;
    scene2.add(front);

    element = document.createElement('div');
    element.className = 'floor';
    element.setAttribute("style","width:640px;height:1560px");

    //CSS Object
    floor = new THREE.CSS3DObject(element);
    floor.position.x = 0;
    floor.position.y = -100;
    floor.position.z = 0;
    floor.rotation.x = Math.PI/2;
    floor.rotation.y = Math.PI;
    scene2.add(floor);

    //CSS3D Renderer
    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    document.body.appendChild(renderer2.domElement);
}

function animate_ambient() {
    requestAnimationFrame(animate_ambient);
    renderer2.render(scene2, camera);
    renderer.render(scene, camera);
    controls.update();
}
