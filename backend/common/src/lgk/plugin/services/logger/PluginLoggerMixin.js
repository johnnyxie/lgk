const Logger = require("lgk/common/Logger");
const App = require("lgk/app/App");

const logLevel = new WeakMap();

class PluginLoggerMixin {

    debug() {
        this.log.apply(this, ["debug", ...arguments]);
    }

    info() {
        this.log.apply(this, ["info", ...arguments]);
    }

    warn() {
        this.log.apply(this, ["warn"].concat(arguments));
    }

    error() {
        this.log.apply(this, ["error"].concat(arguments));
    }

    log() {
        if (this.level !== false) {
            //undefined is still treated as enabled
            Logger.log.apply(Logger, [...arguments]);
        }
    }

    get level() {
        return logLevel.get(this) || "info"; //default level is info
    }

    set level(value) {
        logLevel.set(this, value);
        return this.level;
    }
}

module.exports = PluginLoggerMixin;