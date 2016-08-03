var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;

var Tail = function(path, grep) {
    this.path = path;
    this.grep = grep;
    this.em = new EventEmitter();
    this.buffer = "";
}

Tail.prototype = {
    start: function() {
        this.proc = spawn('tail', ['-f', this.path]);
        this.proc.stdout.on('data', (data) => {
            this.buffer += data;
            this.preprocessIncomingData();
        });
    },
    preprocessIncomingData: function() {
        if(this.buffer.indexOf('\n') > -1) {
            var tmpBuf = this.buffer.split('\n');
            var line = tmpBuf.shift().trim();
            this.buffer = tmpBuf.join('\n');
            if(line.length > 0) {
                if(this.grep && line.indexOf(this.grep) === -1) {
                    return;
                }
                this.em.emit('line', line);
            }
        }
        if(this.buffer.indexOf('\n') > -1) {
            this.preprocessIncomingData();
        }
    },
    onLineReceived: function(callback) {
        this.em.on('line', callback);
    }
}

module.exports = Tail;
