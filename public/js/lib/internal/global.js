window.AudioContext = window.AudioContext || window.webkitAudioContext;

var DEBUG = true;

if (!DEBUG) {
    console.log = function() {

    }
    console.info = function() {

    }
    console.warn = function() {

    }
    console.debug = function() {

    }
}

var lastCommand = Date.now(),
    lastAckHealth = { healthy: true },
    lastLidarStatus = false;

var socket = io();
socket
    .on('command', function (command) {
        lastCommand = Date.now();
        window[command.wall].motors.forEach(function(motor, index) {
            motor.sendCommand(command.motors[index]);
        });
    })
    .on('ackHealth_ui', function(data) {
        lastAckHealth = data;
    })
    .on('lidarStatus_ui', function(status) {
        lastLidarStatus = status;
        checkStatuses();
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

    if(checkStatuses.lastAckStatus !== lastAckHealth.healthy) {
        var color, text;
        if(lastAckHealth.healthy) {
            color = '#00E029';
            text = 'Acking as hell';
        } else {
            color = '#CC0000';
            text = 'OMFG'
            notifications.fire('Engines Status', 'Acks are not going through!');
        }
        leftGui.updateStatusForEngines(color, text);
        checkStatuses.lastAckStatus = lastAckHealth.healthy;
    }

    if(checkStatuses.lastLidarStatus != lastLidarStatus) {
        var color, text;
        if(lastLidarStatus) {
            color = '#00E029';
            text = 'Dancing';
        } else {
            color = '#D4DE11';
            text = 'Asleep';
        }
        leftGui.updateStatusForLidar(color, text);
        checkStatuses.lastLidarStatus = lastLidarStatus;
    }
};

checkStatuses.lastCommandStatus = true;

setInterval(checkStatuses, 5000);

//get keys for GAMES
$(document).keypress(function(event) {
    var key = event.which;
    socket.emit('keyboard', key);
});
