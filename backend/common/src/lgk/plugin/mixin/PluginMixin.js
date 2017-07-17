const Promise = require("promise");
const Logger = require("lgk/common/Logger");

class PluginMixin {
    init() {
        return Promise.resolve(true);
    }
}

module.exports = PluginMixin;