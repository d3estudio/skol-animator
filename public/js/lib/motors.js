var Motor = function(x, y, color, parent, id) {
    var _this = this;
    _this.x = x;
    _this.y = y;
    _this.parent = $(parent);
    _this.id = id;
    _this.body = $('<div class="block"></div>');
    _this.hole = $('<div class="hole"></div>');
    _this.circle = $('<div class="circle"><div class="mirror"></div></div>');
    _this.init = function() {
        _this.hole.css({"box-shadow":"0 0 0 99999px "+color});
        _this.hole.css({"-webkit-box-shadow":"0 0 0 99999px "+color});
        _this.hole.css({"-moz-box-shadow":"0 0 0 99999px "+color});
        _this.circle.css({background:color});
        _this.parent.append(_this.body);
        _this.body.append(_this.hole).append(_this.circle);
    }
    _this.setAnimation = function(animation) {
        _this.body.addClass(animation);
    }
    _this.removeAnimation =  function(animation) {
        _this.body.removeClass(animation);
    }
}
