var Ambient = function(where, cameraPosition, width, height) {
    var _this = this;
    _this.scene = null;
    _this.camera;
    _this.controls;
    _this.renderer;
    _this.css_renderer;
    _this.width = width;
    _this.height = height;
    _this.cameraPosition = cameraPosition;
    _this.where = where;
    var element;

    _this.init = function() {
        //camera
        _this.camera = new THREE.PerspectiveCamera(_this.cameraPosition.distance, _this.width / _this.height, 1, 10000);
        _this.camera.position.set(_this.cameraPosition.x, _this.cameraPosition.y, _this.cameraPosition.z);

        //WebGL Renderer
        _this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        _this.renderer.setClearColor(0x666666, 1)
        _this.renderer.setSize(window.innerWidth, window.innerHeight);
        _this.renderer.domElement.style.zIndex = 5;
        _this.where.appendChild(_this.renderer.domElement);

        //CSS3D Scene
        _this.scene = new THREE.Scene();

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
        _this.scene.add(roof);

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
        _this.scene.add(left);

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
        _this.scene.add(right);

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
        _this.scene.add(front);

        element = document.createElement('div');
        element.className = 'floor';
        element.setAttribute("style", "width:640px;height:1560px");

        //CSS3D Renderer
        _this.css_renderer = new THREE.CSS3DRenderer();
        _this.css_renderer.setSize(window.innerWidth, window.innerHeight);
        _this.css_renderer.domElement.style.position = 'absolute';
        _this.css_renderer.domElement.style.top = 0;
        _this.where.appendChild(_this.css_renderer.domElement);

        //controls
        _this.controls = new THREE.OrbitControls(_this.camera, _this.css_renderer.domElement);
        _this.controls.rotateSpeed = 1.0;
        _this.controls.zoomSpeed = 1.2;
        _this.controls.panSpeed = 0.8;
    }
    _this.animate = function() {
        setTimeout(function() {
            requestAnimationFrame(_this.animate);
        }, 100);
        _this.css_renderer.render(_this.scene, _this.camera);
        _this.renderer.render(_this.scene, _this.camera);
        _this.controls.update();
    }
}
