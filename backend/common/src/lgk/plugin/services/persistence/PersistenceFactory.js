const PluginServiceFactory = require("lgk/plugin/services/PluginServiceFactory");
const PluginServiceRegistry = require("lgk/plugin/services/PluginServiceRegistry");

const Persistence = require("lgk/plugin/services/persistence/Persistence");
const PersistenceMixin = require("lgk/plugin/services/persistence/PersistenceMixin");

class PersistenceFactory extends PluginServiceFactory {
    createServiceForPlugin(plugin) {
        return new Persistence(plugin)
    }

    getMixin () {
        return PersistenceMixin;
    }
}

module.exports = new PersistenceFactory();
PluginServiceRegistry.register("persistence", module.exports);
