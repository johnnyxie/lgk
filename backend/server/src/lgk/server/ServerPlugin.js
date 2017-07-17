const Promise = require("bluebird");
const Constants = require("lgk/common/Constants");
const Plugin = require("lgk/plugin/Plugin");

const servers = new WeakMap();
class ServerPlugin extends Plugin {

    register(server, options) {
        servers.set(this, server);
        return Promise.resolve(true);
    }

    get server() {
        return servers.get(this);
    }
}
module.exports = ServerPlugin;