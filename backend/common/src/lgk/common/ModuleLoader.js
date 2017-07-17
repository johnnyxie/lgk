'use strict';

const pluginLoader = require("lgk/plugin/PluginLoader");

class ModuleLoader {
    secure() {
        let Module = require("module");
        let originalLoad = Module._load;
        Module._load = function (requestedModule, requestingModule) {
            if (requestingModule && requestingModule.filename) {
                //This is for example on how to prevent plugins from accessing things they should not access
                //throw an exception here
                pluginLoader.isAccessible(requestingModule, requestedModule);
            }
            return originalLoad.apply(this, arguments);
        };
    }
}

module.exports = new ModuleLoader();