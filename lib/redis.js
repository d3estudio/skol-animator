//libs
var Redis = require('ioredis');
var helper = require('../lib/shared');

var RedisClient = function() {
    this.serverUrl = undefined; // ioredis defaults to 127.0.0.1:6379
    this.apiSequence = 0;
    this.apiSequenceMaximum = 32767;
    this.destinationChannel = 'd3skol.router.map.in';
    this.sourceChannel = 'd3skol.router.map.out';
    this.ackCallback = function() { };
    this.open();
};

RedisClient.prototype = {
    nextApiSeq: function() {
        var next = this.apiSequence++;
        if(this.apiSequence >= this.apiSequenceMaximum) {
            this.apiSequence = 0;
        }
        return next;
    },
    send: function(command, payload) {
        payload = payload || {};
        var packet = {
            d: this.destinationChannel,
            s: this.sourceChannel,
            c: command,
            p: [JSON.stringify(payload)],
            a: 0,
            sq: this.nextApiSeq()
        };
        this.writeClient.publish(this.destinationChannel, JSON.stringify(packet));
    },
    open: function() {
        if(!this.listenClient) {
            this.listenClient = new Redis(this.serverUrl);
            this.listenClient.subscribe(this.sourceChannel);
            this.listenClient.on('message', this.processIncomingMessage.bind(this));
        }
        if(!this.writeClient) {
            this.writeClient = new Redis(this.serverUrl);
        }
    },
    close: function() {
        this.listenClient.disconnect();
        this.writeClient.disconnect();
        this.listenClient = null;
        this.writeClient = null;
    },
    processIncomingMessage: function(channel, message) {
        try {
            var m = JSON.parse(message);
            if(!!m.a) {
                this.ackCallback();
            }
        } catch(ex) {
            helper.logger.debug(`[RedisClient] Error processing incoming message: ${ex.message}`);
            helper.logger.debug(ex.stack);
        }
    }
};

module.exports = RedisClient;
