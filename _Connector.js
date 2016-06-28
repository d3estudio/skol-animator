//main functions
var helper = require('./_Functions');

//libs
var lwip = require('lwip');

var left = helper.readFile('left-simulator.png', function(filename) {
    if (filename) {
        lwip.open(filename, 'png', function(err, image) {
            if (!err) {
                helper.logger.debug(image.getPixel(10, 4));
            }
        });
    };
});
left.init();
