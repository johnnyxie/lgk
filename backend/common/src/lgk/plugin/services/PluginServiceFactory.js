const Promise = require("bluebird");

class PluginServiceFactory {

    constructor() {
        this._pluginToServiceMap = {};
    }

    init() {
        return Promise.resolve(true);
    }

    getServiceForPlugin(plugin, create = true) {
        let service = this._pluginToServiceMap[plugin.id];
        if (service) {
            return service;
        } else if (create) {
            service = this.createServiceForPlugin(plugin);
            this._pluginToServiceMap[plugin.id] = service;
            return service
        } else {
            return null;
        }
    }

    getMixin() {
        return null;
    }

    createServiceForPlugin(plugin) {
        return null;
    }
}

module.exports = PluginServiceFactory;