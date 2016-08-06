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
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL STOP THE CURRENT ANIMATION(S)')) {
            socket.emit('stop');
        }
    };
    this.STOP_ALL.dangerous = true;
};

var AdminCommands = function() {
    this.DISABLE____0xFF = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL DISABLE ALL MOTORS')) {
            socket.emit('animation', 0xFF);
        }
    };
    this.CALIBRATE____0xFE = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL RECALIBRATE ALL THE MOTORS TO ZERO')) {
            socket.emit('animation', 0xFE);
        }
    };
    this.RESET____0xFC = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL RESET ALL MOTORS')) {
            socket.emit('animation', 0xFC);
        }
    };
    this.SET_ZERO_TO_POS____0xFD = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL SET THE CURRENT ANGLE TO ACT AS ZERO')) {
            socket.emit('animation', 0xFD);
        }
    };
    this.HALT____0xFB = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL (DONT REMEMBER) ALL THE MOTORS')) {
            socket.emit('animation', 0xFB);
        }
    };
    this.RANDOM_POSITION = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL ROTATE ALL THE MOTORS TO A RANDOM POSITION')) {
            socket.emit('animation', {
                animation: 'RandomPosition'
            });
        }
    };
    this.AUTO_PILOT = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL START OR STOP THE AUTO PILOT (IF RUNNING)')) {
            socket.emit('auto_pilot');
        }
    };
    this.LIDAR_ANIM = function() {
        socket.emit('animation', {
            animation: 'lidar'
        })
    }
    this.ENABLE_LIDAR = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL START THE LIDAR')) {
            socket.emit('animation', {
                animation: 'enable_lidar'
            });
        }
    }
}

var Games = function() {
    this.SNAKE = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL PLAY THE SNAKE')) {
            socket.emit('play', 'snake');
        }
    }
}

var BasicAngles = function() {
    this.SEND = function() {
        if (window.confirm('ARE YOU SURE???? \n\nTHIS WILL ROTATE ALL THE MOTORS TO THE SPECIFIED ANGLE')) {
            socket.emit('animation', {
                animation: 'BasicAngle',
                angle: parseInt(this.angle)
            });
        }
    };
    this.angle = 0x14;
}

var LidarLevel = function() {
    this.SEND = function() {
        socket.emit('animation', {
            animation: 'lidar',
            downward: this.downward,
            upward: this.upward
        });
    };
    this.downward = 1;
    this.upward = 1;
}

var Unicast = function() {
    this.SEND = function() {
        socket.emit('unicast', {
            x: this.x,
            y: this.y,
            wall: this.wall,
            command: parseInt(this.command)
        });
    };
    this.wall = 'roof';
    this.x = 0;
    this.y = 0;
    this.command = '0x14';
}

var Statuses = function() {
    this.server = {
        color: '#00E029',
        status: 'Healthy as fuck'
    };
    this.engines = {
        color: '#00E029',
        status: 'Acking as hell'
    };
    this.socket = {
        color: '#00E029',
        status: 'Alive\'n\'kickin\''
    };
}

createFolder('Stop All', new StopAllButton(), ['STOP_ALL']);
createFolder('Admin Commands', new AdminCommands(), [
    'DISABLE____0xFF',
    'CALIBRATE____0xFE',
    'RESET____0xFC',
    'SET_ZERO_TO_POS____0xFD',
    'HALT____0xFB',
    'RANDOM_POSITION',
    'AUTO_PILOT',
    'ENABLE_LIDAR'
]);
createFolder('Games', new Games(), ['SNAKE']);
createFolder('Lidar Levels', new LidarLevel(), ['SEND'], {
    before: function(folder, prop) {
        folder.add(prop, 'downward', 0);
        folder.add(prop, 'upward', 0);
    }
})
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
createFolder('Unicast', new Unicast(), ['SEND'], {
    before: function(folder, prop) {
        folder.add(prop, 'wall', {
            'Top': 'roof',
            'Left': 'leftWall',
            'Front': 'frontWall',
            'Right': 'rightWall'
        });
        folder.add(prop, 'x', 0);
        folder.add(prop, 'y', 0);
        folder.add(prop, 'command', '0x14');
    }
});

createFolder('Statuses', new Statuses(), ['server', 'engines', 'socket']);

var container = document.getElementById('left-menu');
container.appendChild(leftGui.domElement);

var noop = function() {};
var updateStatusFactory = function(name) {
    var target = leftGui.__folders.Statuses.__controllers.find(function(c) {
        return c.property === name;
    });
    if (!target) {
        return noop;
    }

    return function(color, status) {
        target.setValue({
            color: color,
            status: status
        });
    };
};

leftGui.updateStatusForServer = updateStatusFactory('server');
leftGui.updateStatusForEngines = updateStatusFactory('engines');
leftGui.updateStatusForSocket = updateStatusFactory('socket');
