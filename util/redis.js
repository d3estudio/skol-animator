var Redis = require('ioredis');

var writeClient = new Redis(),
    listenClient = new Redis(),
    destinationChannel = 'd3skol.router.map.out';

listenClient.subscribe('d3skol.router.map.in');
listenClient.on('message', function(channel, message) {
    try {
        var m = JSON.parse(message);
        m.a = true;
        writeClient.publish(destinationChannel, JSON.stringify(m));
    } catch(ex) {
        console.debug(`[RedisClient] Error processing incoming message: ${ex.message}`);
        console.debug(ex.stack);
    }
});
