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


// FUTURE

// var cmd = 0x00,
//     step = 0x00,
//     angle = 0;
//
// if (cmd < 0x14) {
//     step = ((0x14 - cmd) * - 0x32 - (0xC8 * (0x13 - cmd)));
// } else if (cmd > 0xDC) {
//     step = (0xC8 + (cmd - 0xDC) * 0x32 + (0xC8 * (cmd - 0xDD)));
// } else {
//     step = cmd - 0x14;
// }
//
// angle = step / 0x32 * 0x5A;
// console.log(angle);

// LINEAR

// de 0x14 para 0x00 - 2:00:08 (24 voltas)
// de 0x00 para 0x14 - 1:59:54 (24 voltas)

// de 0x14 para 0xDC - 0:05:20 (1 volta)
// de 0xDC para 0x14 - 0:05:21 (1 volta)

// de 0xDC para 0xF0 - 1:59:51 (24 voltas)
// de 0xF0 para 0xDC - 1:59:73 (24 voltas)

// de 0x00 para 0xF0 - 4:04:67 (49 voltas)
// de 0xF0 para 0x00 - 4:04:32 (49 voltas)

// ACELERADO

// de 0x14 para 0x00 - 1:01:40 (24 voltas)
// de 0x00 para 0x14 - 1:01:40 (24 voltas)

// de 0x14 para 0xDC - 0:02:54 (1 volta)
// de 0xDC para 0x14 - 0:02:68 (1 volta)

// de 0xDC para 0xF0 - 1:01:40 (24 voltas)
// de 0xF0 para 0xDC - 1:01:40 (24 voltas)

// de 0x00 para 0xF0 - 2:04:91 (49 voltas)
// de 0xF0 para 0x00 - 2:04:97 (49 voltas)
