var exec = require("child_process").exec;

var execSysd = function() {
    return new Promise((resolve, reject) => {
        var args = Array.prototype.slice.call(arguments);
        exec(`systemctl --no-pager ${args.join(' ')}`, (error,stdout,stderr) => {
            if(error) {
                return reject(error);
            }
            resolve({ stderr, stdout });
        });
    });
};

var Systemd = {
    status: function(name) {
        return execSysd(`is-active ${name}`)
            .then(result => {
                if(result.stdout.trim() === 'active') {
                    return { active: true, output: result }
                } else {
                    return { active: false, output: result }
                }
            });
    },
    start: function(name) {

    }
};

module.exports = Systemd;
