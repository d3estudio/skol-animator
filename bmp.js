var fs = require('fs');
var lwip = require('lwip');

console.log(new Date().getMilliseconds())
lwip.create(17, 5, {
    r: 0x14,
    g: 0x14,
    b: 0x14
}, function(err, image) {
    writePixels(image, 17, 0, 0x14, 'left.png');
});
lwip.create(17, 5, {
    r: 0x14,
    g: 0x14,
    b: 0x14
}, function(err, image) {
    writePixels(image, 17, 0, 0x14, 'right.png');
});
lwip.create(11, 5, {
    r: 0x14,
    g: 0x14,
    b: 0x14
}, function(err, image) {
    writePixels(image, 11, 0, 0x14, 'front.png');
});
lwip.create(17, 11, {
    r: 0x14,
    g: 0x14,
    b: 0x14
}, function(err, image) {
    writePixels(image, 17, 0, 0x14, 'top.png');
});

function writePixels(image, size, i, base, name) {
    var y = Math.floor(i / size),
        x = Math.floor(i - (size * y));
    if (y > 4) {
        finish(image, name);
    } else {
        image.setPixel(x, y, {
            r: base,
            g: base,
            b: base
        }, function(err, image) {
            i++;
            base++;
            writePixels(image, size, i, base, name);
        });
    }
}

function finish(image, name) {
    image.writeFile(name, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(name, new Date().getMilliseconds());
        }
    });
}
