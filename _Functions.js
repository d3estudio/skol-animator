var config = require('./settings.json'),
    log4js = require('log4js').getLogger(),
    fs = require('fs');


var readFile = function(filename, callback) {
    var _this = this;
    _this.filename = filename;
    _this.callback = callback;
    _this.init = () => {
        fs.watch(_this.filename, (event, file) => {
            if (file) {
                _this.callback(file);
            }
        });
    }
}

module.exports = {
    logger: {
        debug: (log) => {
            log4js.debug(log);
        },
        error: (log) => {
            log4js.error(log);
        }
    },
    readFile: (filename, callback) => {
        return new readFile(filename, callback);
    }
}
