const Promise = require("promise");
const Constants = require("lgk/common/Constants");
const deepFreeze = require("deep-freeze");

class Plugin {
    initializePlugin(pkg) {
        this.package = deepFreeze(Object.assign({}, pkg));
        this.dir = pkg.dir;
        if (pkg.apiPrefix) {
            this.apiPrefix = (pkg.apiPrefix[0] === "/" ? pkg.apiPrefix : "/" + pkg.apiPrefix);
        } else {
            this.apiPrefix = pkg.name + "/" + pkg.version;
        }
        this.id = `${pkg.name}_${pkg.version}`;
        this.name = pkg.name || "<unknown>";
    }

    init() {
        return Promise.resolve(true);
    }

    services(services) {
        if (services) {
            this._services = services;
        }
        return this._services;
    }
}

module.exports = Plugin;