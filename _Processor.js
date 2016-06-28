//main functions
var helper = require('./_Functions');

//libs
var lwip = require('lwip');
var fs = require('fs');

helper.logger.debug('Will write');
lwip.create(17, 5, {
    r: 0x14,
    g: 0x14,
    b: 0x14
}, function(err, image) {
    writePixels(image, 17, 0, 'left.png');
});

lwip.create(17, 5, {
    r: 0x14,
    g: 0x14,
    b: 0x14
}, function(err, image) {
    writePixels(image, 17, 0, 'right.png');
});

lwip.create(17, 5, {
    r: 0x14,
    g: 0x14,
    b: 0x14
}, function(err, image) {
    writePixels(image, 17, 0, 'front.png');
});

lwip.create(17, 5, {
    r: 0x14,
    g: 0x14,
    b: 0x14
}, function(err, image) {
    writePixels(image, 17, 0, 'top.png');
});

function writePixels(image, size, i, name) {
    var color = Math.floor(Math.random() * 255);
    var y = Math.floor(i / size),
        x = Math.floor(i - (size * y));
    if (y > 4) {
        finish(image, name);
    } else {
        image.setPixel(x, y, {
            r: color,
            g: color,
            b: color
        }, function(err, image) {
            i++;
            writePixels(image, size, i, name);
        });
    }
}

function finish(image, name) {
    image.toBuffer('png', (err, buffer) => {
        if (err) {
            helper.logger.error(err);
        } else {
            var stream = fs.createWriteStream(name);
            stream.write(buffer);
            helper.logger.debug('Written File ' + name);
            stream = fs.createWriteStream(name.replace('.png','-simulator.png'));
            stream.write(buffer);
            helper.logger.debug('Written File ' + name.replace('.png','-simulator.png'));
            stream.close();
        }
    });
}
