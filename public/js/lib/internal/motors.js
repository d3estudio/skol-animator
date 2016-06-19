var Motor = function(x, y, color, parent, id) {
    var _this = this;

    //index on the matrix
    _this.x = x;
    _this.y = y;

    //where this motor is hold
    _this.parent = $(parent);

    //motor ID
    _this.id = id;

    //motor status
    _this.locked = false;

    //motor simulation representation
    _this.body = $('<div class="block"></div>');
    _this.hole = $('<div class="hole"></div>');
    _this.circle = $('<div class="circle"><div class="mirror"><div class="line"></div></div></div>');

    //add this motor to the 3D preview
    _this.init = function() {
        _this.hole.css({
            "box-shadow": "0 0 0 99999px " + color
        });
        _this.hole.css({
            "-webkit-box-shadow": "0 0 0 99999px " + color
        });
        _this.hole.css({
            "-moz-box-shadow": "0 0 0 99999px " + color
        });
        _this.circle.css({
            background: color
        });
        _this.parent.append(_this.body);
        _this.body.append(_this.hole).append(_this.circle);
    }

    //restart this motor
    _this.create = function() {
        _this.body.css({
            background: 'none'
        });
        _this.init();
    }

    //remove this motor from preview
    _this.destroy = function() {
        _this.body.html('');
        _this.body.css({
            background: color
        });
    }

    //lock this motor to wait the current command
    _this.lock = function() {
        _this.locked = true;
    }

    //unlock this motor and allow another command
    _this.unlock = function() {
        _this.locked = false;
    }

    //send a command to rotate the motor according to the following table:
    _this.sendCommand = function(cmd) {
        console.log(cmd);
    }

    /* this will be deprecated and must be deleted */
    _this.setAnimation = function(animation) {
        _this.body.addClass(animation);
    }
    _this.removeAnimation = function(animation) {
        _this.body.removeClass(animation);
    }
}
