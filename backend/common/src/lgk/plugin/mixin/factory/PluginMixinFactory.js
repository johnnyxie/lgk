const Promise = require("promise");
class PluginMixinFactory {

    init() {
        return Promise.resolve(true);
    }

    getMixinsFor(plugin) {
        return null;
    }
}

module.exports = PluginMixinFactory;