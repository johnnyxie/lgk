const PluginMixin = require("lgk/plugin/mixin/PluginMixin");

const servers = new WeakMap();
class WebServerMixin extends PluginMixin {

    set server(server) {
        servers.set(this, server);
    }

    get server() {
        return servers.get(this);
    }

    registerRoutes(server, options = {}) {
        this.server = server;
        return Promise.resolve(true);
    }

    onWebSocketConnected(socket) {
    }

    onWebSocketDisconnected(socket) {
    }
}
module.exports = WebServerMixin;