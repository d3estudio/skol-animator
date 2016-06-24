// modules
var express = require('express'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    consolidate = require('consolidate');

// controllers
var publicController = require('./controllers/public');

// webserver configuration
var app = express();
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
    .get('/', publicController.index);

// run
app.listen(3000);
console.log('Listening on port 3000');
