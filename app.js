//base http and socket
var app = require('express')(),
    express = require('express'),
    http = require('http').Server(app),
    serverSocket = require('socket.io')(http),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    consolidate = require('consolidate');

// main functions
var helper = require('./lib/shared');
var settings = require('./settings.json');

// controllers
var publicController = require('./controllers/public');

// We keep the last engine health check, so we can emit it
// as soon as the client connects.
var lastHealthStatus;

// webserver configuration
app
    .set('views', __dirname + '/views')
    .set('view engine', 'ejs')
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
    .use(express.static(__dirname + '/public'))
    .engine('html', consolidate.swig)
    .enable('trust proxy');

// public routes
app
    .get('/', publicController.index)
    .get('/mobile', publicController.mobile)
    .get('/lidar/:upward/:downward', (req, res) => {
        serverSocket.emit('lidar', parseFloat(req.params.upward)+parseFloat(req.params.downward));
        res.status(200).end();
    });

// run
http.listen(settings.SOCKET_PORT);
helper.logger.debug(`Listening on port ${settings.SOCKET_PORT}`);

serverSocket.on('connection', (clientSocket) => {
    helper.logger.debug(`[CLIENT] ${clientSocket.id} CONNECTED`);
    if(lastHealthStatus !== undefined) {
        serverSocket.emit('ackHealth', lastHealthStatus);
    }
    clientSocket
        .on('update', (command) => {
            serverSocket.emit('command', command);
        })
        .on('animation', (command) => {
            serverSocket.emit('exec', command);
        })
        .on('unicast', (command) => {
            serverSocket.emit('single', command);
        })
        .on('fftArray', (command) => {
            serverSocket.emit('fft', command);
        })
        .on('stop', () => {
            serverSocket.emit('freeze');
        })
        .on('auto_pilot', () => {
            serverSocket.emit('the_beast');
        })
        .on('myo', (action) => {
            serverSocket.emit('magic', action);
        })
        .on('quaternion', (quaternion) => {
            console.log(quaternion);
            serverSocket.emit('orientation', quaternion);
        })
        .on('double_tap', (action) => {
            serverSocket.emit('pose');
        })
        .on('ackHealth', (data) => {
            lastHealthStatus = data;
            serverSocket.emit('ackHealth', lastHealthStatus);
        });
});
