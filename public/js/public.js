var WIDTH = 13;
var HEIGHT = 5;
var currentCol = WIDTH-1;
var billboard = new Alphabet();
var message = billboard.textToBin('SKOL');

function drawMessage(currentCol) {
    var x = currentCol;
    var shift = 0;
    message.forEach(function(letter, letterIndex) {
        //console.log(letter);

        letter.forEach(function(line, lineIndex) {
            line.forEach(function(dot, dotIndex) {
                var bit = $("div[data-x='"+(currentCol+dotIndex+shift)+"'][data-y='"+lineIndex+"']");
                if (dot) {
                    bit.addClass('flip');
                } else {
                    bit.removeClass('flip');
                }
            })
        });
        shift += letter[0].length;
    });
}

function draw() {
    //console.log(new Date());
    setTimeout(function() {
        if (currentCol >= -(message.length*4)) {
            requestAnimationFrame(draw);
            drawMessage(currentCol);
            currentCol--;
        }
    }, 1000);
}

draw();
