var Color = function(parent, index) {
    var _this = this;
    _this.parent = parent;
    _this.index = index;
    _this.colors = {
        top: ['rgba(134,151,107,1)'],
        left: [],
        front: [],
        right: []
    }
    _this.getColor = function() {
        if (_this.parent === 'top') {
            return _this.colors.top[0];
        }
        return _this.colors[_this.parent][_this.index];
    }
}
