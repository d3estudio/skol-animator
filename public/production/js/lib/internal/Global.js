window.AudioContext = window.AudioContext || window.webkitAudioContext;

var DEBUG = true;

if (!DEBUG) {
    console.log = function() {

    }
    console.info = function() {

    }
    console.warn = function() {

    }
}

var lastCommand = Date.now();
var socket = io();
socket.on('command', function (command) {
    lastCommand = Date.now();
    window[command.wall].motors.forEach(function(motor, index) {
        motor.sendCommand(command.motors[index]);
    });
});

var checkStatuses = function() {
    if(leftGui && checkStatuses.lastSocketStatus !== socket.connected) {
        var color, text;
        if(socket.connected) {
            color = '#00E029';
            text = 'Alive\'n\'kickin\'';
        } else {
            color = '#CC0000';
            text = 'Something is wrong!'
            notifications.fire('Socket Status', 'Connection lost!');
        }
        leftGui.updateStatusForSocket(color, text);
        checkStatuses.lastSocketStatus = socket.connected;
    }

    if(socket.connected) {
        if(Date.now() - lastCommand >= 1000) {
            if(checkStatuses.lastCommandStatus) {
                leftGui.updateStatusForServer('#CC0000', 'Too quiet!');
                notifications.fire('Server Status', 'Isn\'t as fast as we expected!');
                checkStatuses.lastCommandStatus = false;
            }
        } else {
            leftGui.updateStatusForServer('#00E029', 'Healthy as fuck');
            checkStatuses.lastCommandStatus = true;
        }
    }
};

checkStatuses.lastCommandStatus = true;

setInterval(checkStatuses, 1000);
