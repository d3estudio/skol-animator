//base http and socket
var app = require('express')(),
    express = require('express'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    consolidate = require('consolidate');

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

// io.on('connection', (socket) => {
//     socket.emit('test', 'message');
//     socket.on('test', (msg) => {
//         console.log(msg);
//     });
// });
