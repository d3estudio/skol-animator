var motors = [];

function init() {

    var globalID = 0;

    // roof 374
    for (var i = 0; i < 374; i++) {
        var y = parseInt(i / 11),
            x = parseInt(i - (11 * y)),
            color = new Color('top', i);
        motor = new Motor(x, y, color.getColor(), '.top', globalID++);
        motor.init();
        if (y < 23) {
            if (y == 22 && (x == 0 || x == 2 || x == 4 || x == 5 || x == 6 || x == 8 || x == 9 || x == 10)) {
                motor.create();
                motors.push(motor);
            } else if (y == 21 && (x == 0 || x == 1 || x == 3 || x == 6 || x == 7 || x == 10)) {
                motor.create();
                motors.push(motor);
            } else if (y == 20 && (x == 2 || x == 3 || x == 5 || x == 7 || x == 10)) {
                motor.create();
                motors.push(motor);
            } else if (y == 19 && (x == 1 || x == 6 || x == 7 || x == 9)) {
                motor.create();
                motors.push(motor);
            } else if (y == 18 && (x == 0 || x == 4 || x == 6)) {
                motor.create();
                motors.push(motor);
            } else if (y == 17 && x == 3) {
                motor.create();
                motors.push(motor);
            } else {
                motor.destroy();
            }
        }
    }

    // left 170
    for (var i = 0; i < 170; i++) {
        var y = parseInt(i / 34),
            x = parseInt(i - (34 * y)),
            color = new Color('left', i);
        motor = new Motor(x, y, color.getColor(), '.left', globalID++);
        motor.init();
        if (x < 21) {
            if (x == 20 && (y == 1 || y == 3)) {
                motor.create();
                motors.push(motor);
            } else if (x == 19 && (y == 1 || y == 4)) {
                motor.create();
                motors.push(motor);
            } else if (x == 18 && (y == 0 || y == 3)) {
                motor.create();
                motors.push(motor);
            } else if (x == 17 && y == 1) {
                motor.create();
                motors.push(motor);
            } else {
                motor.destroy();
            }
        }
    }

    // right 170
    for (var i = 0; i < 170; i++) {
        var y = parseInt(i / 34),
            x = parseInt(i - (34 * y)),
            color = new Color('right', i);
        motor = new Motor(x, y, color.getColor(), '.right', globalID++);
        motor.init();
        if (x > 12) {
            if (x == 13 && (y == 0 || y == 1)) {
                motor.create();
                motors.push(motor);
            } else if (x == 14 && y == 2) {
                motor.create();
                motors.push(motor);
            } else if (x == 15 && y == 1) {
                motor.create();
                motors.push(motor);
            } else if (x == 16 && y == 3) {
                motor.create();
                motors.push(motor);
            } else {
                motor.destroy();
            }
        }
    }

    // front 55
    for (var i = 0; i < 55; i++) {
        var y = parseInt(i / 11),
            x = parseInt(i - (11 * y)),
            color = new Color('front', i);
        motor = new Motor(x, y, color.getColor(), '.front', globalID++);
        motors.push(motor);
        motor.init();
    }

    $('.block').css({
        width: 40,
        height: 40
    });
}

// init
init();
