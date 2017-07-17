const PluginMixinFactory = require("lgk/plugin/mixin/factory/PluginMixinFactory");
const Logger = require("lgk/common/Logger");

class DefaultMixinFactory extends PluginMixinFactory {

    constructor(moduleName, moduleType) {
        super();
        this.moduleName = moduleName;
        this.moduleType = moduleType;
    }

    getMixinsFor(plugin) {
        let mixin = plugin && plugin.modules && plugin.modules[this.moduleName] && plugin.modules[this.moduleName].module ? plugin.modules[this.moduleName].module : null;
        if (mixin) {
            if (mixin.prototype instanceof this.moduleType) {
                Logger.info(`${this.moduleName} found for ${plugin.name}`);
                return [mixin];
            } else {
                Logger.error(`${plugin.id} does not seem to have the right ${this.moduleType}. It should inherit from ${this.moduleType}`);
            }
        } else {
            Logger.info(`JobWorkerMixin not found for ${plugin.name}`);
        }
        return null;
    }
}

module.exports = DefaultMixinFactory;

