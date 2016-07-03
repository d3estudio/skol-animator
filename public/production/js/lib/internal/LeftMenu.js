var leftGui = new dat.GUI({
    autoPlace: false
});

var createFolder = function(name, prop, items, custom) {
    custom = custom || {};
    var folder = leftGui.addFolder(name);
    if (!!custom.before) {
        custom.before(folder, prop);
    }
    items.forEach(function(i) {
        folder.add(prop, i);
    });
    folder.open();
    if (!!custom.after) {
        custom.after(folder, prop);
    }
};

var StopAllButton = function() {
    this.STOP_ALL = function() {
        socket.emit('stop');
    };
    this.STOP_ALL.dangerous = true;
};

var AdminCommands = function() {
    this.DISABLE = function() {
        socket.emit('animation', 0xFF);
    };
    this.CALIBRATE = function() {
        socket.emit('animation', 0xFE);
    };
    this.RESET = function() {
        socket.emit('animation', 0xFC);
    };
    this.SET_ZERO_TO_POS = function() {
        socket.emit('animation', 0xFD);
    };
    this.HALT = function() {
        socket.emit('animation', 0xFB);
    };
}

var BasicAngles = function() {
    this.SEND = function() {
        socket.emit('animation', {
            animation: 'BasicAngle',
            angle: this.angle
        });
    };
    this.angle = 0x14;
}

var ServerStatus = function() {
    this.status = {
        color: '#00E029',
        status: 'Healthy as fuck'
    };
}

var MotorAcks = function() {
    this.status = {
        color: '#00E029',
        status: 'Acking as hell'
    };
}

var SocketStatus = function() {
    this.status = {
        color: '#00E029',
        status: 'Alive\'n\'kickin\''
    };
}

createFolder('Stop All', new StopAllButton(), ['STOP_ALL']);
createFolder('Admin Commands', new AdminCommands(), [
    'DISABLE',
    'CALIBRATE',
    'RESET',
    'SET_ZERO_TO_POS',
    'HALT'
]);
createFolder('Basic Angles', new BasicAngles(), ['SEND'], {
    before: function(folder, prop) {
        folder.add(prop, 'angle', {
            '0º': 0x14,
            '45º': 0x19,
            '90º': 0x1E,
            '135º': 0x23,
            '180º': 0x28,
            '225º': 0x2D,
            '270º': 0x32,
            '315º': 0x37,
            '360º': 0x3C
        });
    }
});
createFolder('Server', new ServerStatus(), ['status']);
createFolder('Motors', new MotorAcks(), ['status']);
createFolder('Socket', new SocketStatus(), ['status']);

var container = document.getElementById('left-menu');
container.appendChild(leftGui.domElement);
