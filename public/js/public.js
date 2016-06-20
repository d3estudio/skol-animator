var WIDTH = 13;
var HEIGHT = 5;
var currentCol = WIDTH - 1;
var billboard = new Alphabet();
var message = billboard.textToBin('SKOL');

function drawMessage(currentCol) {
    var x = currentCol;
    var shift = 0;
    message.forEach(function(letter, letterIndex) {
        //console.log(letter);

        letter.forEach(function(line, lineIndex) {
            line.forEach(function(dot, dotIndex) {
                var x = currentCol + dotIndex + shift,
                    y = lineIndex,
                    bit;
                motors.forEach(function(motor) {
                    if (motor.x == x && motor.y == y) {
                        bit = motor;
                        if (dot) {
                            bit.sendCommand(0x28);
                        } else {
                            bit.sendCommand(0x14);
                        }
                    }
                });
            })
        });
        shift += letter[0].length;
    });
}

function draw() {
    //console.log(new Date());
    setTimeout(function() {
        if (currentCol >= -(message.length * 4)) {
            requestAnimationFrame(draw);
            drawMessage(currentCol);
            currentCol--;
        }
    }, 3000);
}

//draw();
