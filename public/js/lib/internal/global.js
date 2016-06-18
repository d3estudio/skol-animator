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

    for (var i = 0; i < 143; i++) {
        var y = parseInt(i / 11),
            x = parseInt(i - (11 * y)),
            color = new Color('top',i);
            motor = new Motor(x, y, color.getColor(), '.top', i);
        motors.push(motor);
        motor.init();
    }
    for (var i = 0; i < 65; i++) {
        var y = parseInt(i / 13),
            x = parseInt(i - (13 * y)),
            color = new Color('top',i);
            motor = new Motor(x, y, color.getColor(), '.left', i);
        motors.push(motor);
        motor.init();
    }
    // for (var i = 0; i < 55; i++) {
    //     var clone = block.clone();
    //     clone.attr('data-global',globalID++);
    //     clone.attr('data-local',i);
    //     var y = parseInt(i/11);
    //     var x = parseInt(i-(11*y));
    //     clone.attr('data-y', y);
    //     clone.attr('data-x', x);
    //     $('.front').append(clone);
    // }
    for (var i = 0; i < 65; i++) {
        var y = parseInt(i / 13),
            x = parseInt(i - (13 * y)),
            color = new Color('top',i);
            motor = new Motor(x, y, color.getColor(), '.right', i);
        motors.push(motor);
        motor.init();
    }
}

// init
init();
resize();

$(window).resize(resize);
