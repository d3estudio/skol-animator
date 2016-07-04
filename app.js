//base http and socket
var app = require('express')(),
    express = require('express'),
    http = require('http').Server(app),
    serverSocket = require('socket.io')(http),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    consolidate = require('consolidate');

// main functions
var helper = require('./lib/Shared');

// controllers
var publicController = require('./controllers/Public');

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
    .get('/prototype', publicController.prototype);

// run
http.listen(3000);
helper.logger.debug(`Listening on port 3000`);

serverSocket.on('connection', (clientSocket) => {
    helper.logger.debug(`[CLIENT] ${clientSocket.id} CONNECTED`);
    if(lastHealthStatus !== undefined) {
        serverSocket.emit('ackHealth', lastHealthStatus);
    }
    //socket.emit('test', 'message');
    clientSocket
        .on('update', (command) => {
            serverSocket.emit('command', command);
        })
        .on('animation', (command) => {
            serverSocket.emit('exec', command);
        })
        .on('fftArray', (command) => {
            serverSocket.emit('fft', command);
        })
        .on('stop', () => {
            serverSocket.emit('freeze');
        })
        .on('ackHealth', (data) => {
            lastHealthStatus = data;
            serverSocket.emit('ackHealth', lastHealthStatus);
        });
});
