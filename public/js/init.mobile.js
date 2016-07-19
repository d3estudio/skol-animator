var socket = io();

$('.ScrollTextSend').click(function() {
    if ($('.ScrollTextText').val().length > 0) {
        socket.emit('animation', {
            animation: 'ScrollText',
            message: $('.ScrollTextText').val(),
            continuous: $('.ScrollTextText').prop('checked'),
            loop: false
        });
    } else {
        window.alert('Type a message!');
    }
});

$('.adminCommand').click(function() {
    if (window.confirm('ARE YOU SURE?')) {
        if ($(this).data('command') == 'stop') {
            socket.emit('stop');
        } else {
            socket.emit('animation', parseInt($(this).data('command')));
        }
    }
});

$('.basicAngle').click(function() {
    if (window.confirm('ARE YOU SURE?')) {
        socket.emit('animation', {
            animation: 'BasicAngle',
            angle: parseInt($(this).data('command'))
        });
    }
});

$('.unicast').click(function(){
    if (window.confirm('ARE YOU SURE?')) {
        socket.emit('unicast', {
            x: parseInt($('.unicastX').val()),
            y: parseInt($('.unicastY').val()),
            wall: $('.unicastW').val(),
            command: parseInt($('.unicastCMD').val())
        });
    }
});

$('.ola').click(function(){
    if (window.confirm('ARE YOU SURE?')) {
        socket.emit('animation', {
            animation: 'Ola',
            type: $(this).data('command'),
            loop: false
        });
    }
});
