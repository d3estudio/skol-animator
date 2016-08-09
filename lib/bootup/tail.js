var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;

var Tail = function(path, grep) {
    this.path = path;
    this.grep = grep;
    this.em = new EventEmitter();
}

Tail.prototype = {
    start: function() {
        this.tail_proc = spawn('tail', ['-f', this.path, '-n', '0', '--sleep-interval', '0.5']);
        if(this.grep) {
            this.grep_proc = spawn('grep', [this.grep, '--line-buffered']);
            this.tail_proc.stdout.on('data', (data) => {
                this.grep_proc.stdin.write(data);
            });
            this.grep_proc.stdout.on('data', (data) => {
                this.preProcess(data.toString());
            });
        } else {
            this.tail_proc.stdout.on('data', (data) => {
                this.preProcess(data.toString());
            });
        }
    },
    preProcess: function(line) {
        line
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0)
            .forEach(l => this.em.emit('line', l));
    },
    onLineReceived: function(callback) {
        this.em.on('line', callback);
    }
}

module.exports = Tail;
