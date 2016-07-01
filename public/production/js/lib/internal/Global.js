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
