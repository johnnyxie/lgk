const PluginServiceFactory = require("lgk/plugin/services/PluginServiceFactory");
const PluginServiceRegistry = require("lgk/plugin/services/PluginServiceRegistry");

const Cache = require("lgk/plugin/services/cache/Cache");
const CacheMixin = require("lgk/plugin/services/cache/CacheMixin");

class CacheFactory extends PluginServiceFactory {
    createServiceForPlugin(plugin) {
        return new Cache(plugin)
    }

    getMixin () {
        return CacheMixin;
    }
}

module.exports = new CacheFactory();
PluginServiceRegistry.register("cache", module.exports);
