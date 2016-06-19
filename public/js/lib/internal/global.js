var block = $('<div class="block" data-global="0" data-local="0" data-x="0" data-y="0"><div class="circle"></div></div>');

function resize() {
    var width = Math.floor($(window).width() / 37);
    document.title = width;
    $('.block').css({
        width: 40,
        height: 40
    });
    // $('.top').css({
    //     width: width * 11,
    //     height: width * 13,
    //     left: width * 13
    // });
    // $('.right').css({
    //     width: width * 13,
    //     height: width * 5
    // });
    // $('.front').css({
    //     width: width * 11,
    //     height: width * 5
    // });
    // $('.left').css({
    //     width: width * 13,
    //     height: width * 5
    // });
}

var motors = [];

function init() {

    var globalID = 0;

    // roof
    for (var i = 0; i < 374; i++) {
        var y = parseInt(i / 11),
            x = parseInt(i - (11 * y)),
            color = new Color('top',i);
            motor = new Motor(x, y, color.getColor(), '.top', i);
        motors.push(motor);
        motor.init();
    }

    // left
    for (var i = 0; i < 170; i++) {
        var y = parseInt(i / 34),
            x = parseInt(i - (34 * y)),
            color = new Color('left',i);
            motor = new Motor(x, y, color.getColor(), '.left', i);
        motors.push(motor);
        motor.init();
    }

    // front
    for (var i = 0; i < 55; i++) {
        var y = parseInt(i / 11),
            x = parseInt(i - (11 * y)),
            color = new Color('front',i);
            motor = new Motor(x, y, color.getColor(), '.front', i);
        motors.push(motor);
        motor.init();
    }

    // right
    for (var i = 0; i < 170; i++) {
        var y = parseInt(i / 34),
            x = parseInt(i - (34 * y)),
            color = new Color('right',i);
            motor = new Motor(x, y, color.getColor(), '.right', i);
        motors.push(motor);
        motor.init();
    }
}

// init
init();
resize();

$(window).resize(resize);