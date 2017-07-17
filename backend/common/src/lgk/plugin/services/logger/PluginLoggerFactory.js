const PluginServiceFactory = require("lgk/plugin/services/PluginServiceFactory");
const PluginServiceRegistry = require("lgk/plugin/services/PluginServiceRegistry");

const PluginLoggerService = require("lgk/plugin/services/logger/PluginLoggerService");
const PluginLoggerMixin = require("lgk/plugin/services/logger/PluginLoggerMixin");

class PluginLoggerFactory extends PluginServiceFactory {

    createServiceForPlugin(plugin) {
        return new PluginLoggerService(plugin);
    }

    getMixin () {
        return PluginLoggerMixin;
    }
}

module.exports = new PluginLoggerFactory();
PluginServiceRegistry.register("logger", module.exports);
