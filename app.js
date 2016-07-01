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
console.log('Listening on port 3000');

serverSocket.on('connection', (clientSocket) => {
    helper.logger.debug(`[CLIENT] ${clientSocket.id} CONNECTED`);
    //socket.emit('test', 'message');
    clientSocket.on('update', (command) => {
        //helper.logger.debug(command);
        //clientSocket.emit('test', 'from server to client');
        serverSocket.emit('command', command);
    });
    clientSocket.on('animation', (command) => {
        //helper.logger.debug(command);
        //clientSocket.emit('test', 'from server to client');
        serverSocket.emit('exec', command);
    });
});
