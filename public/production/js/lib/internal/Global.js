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

var socket = io();
socket.on('command', function (command) {
    window[command.wall].motors.forEach(function(motor, index) {
        motor.sendCommand(command.motors[index]);
    });
});

var checkSocketStatus = function() {
    if(leftGui && checkSocketStatus.lastStatus !== socket.connected) {
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
        checkSocketStatus.lastStatus = socket.connected;
    }
}

setInterval(checkSocketStatus, 1000);
