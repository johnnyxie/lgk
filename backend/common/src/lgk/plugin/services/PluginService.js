const Promise = require("bluebird");

class PluginService {

    constructor(plugin) {
        this.plugin = plugin;
    }

    init() {
        return Promise.resolve(true);
    }
}
module.exports = PluginService;