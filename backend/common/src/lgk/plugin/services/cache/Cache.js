const redis = require("redis");
const Promise = require("bluebird");
const _ = require("lodash");
const App = require("lgk/app/App");
const Constants = require("lgk/common/Constants");
const PluginService = require("lgk/plugin/services/PluginService");
const Logger = require("lgk/common/Logger");

const isConnected = new WeakMap();
const redisClient = new WeakMap();
const permittedGlobalPrefixes = new WeakMap();

class Cache extends PluginService {

    get connected() {
        return isConnected.get(this);
    }

    get _redisClient() {
        return redisClient.get(this);
    }

    get permittedGlobalPrefixes() {
        return permittedGlobalPrefixes.get(this);
    }

    get keyPrefix() {
        return App.get("services.redis.keyPrefix");
    }

    connect() {
        if (this.connected) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(true)
                .then(() => {
                    Logger.info(`Connecting to redis server at ${App.get("services.redis.url")} for plugin ${this.plugin.id}`);
                    let _redisClient = redis.createClient({
                        url: App.get("services.redis.url"),
                        retry_strategy: (options) => {
                            if (options.error && options.error.code === 'ECONNREFUSED') {
                                // End reconnecting on a specific error and flush all commands with a individual error
                                Logger.error(`Redis server at ${App.get("services.redis.url")} refused connection for plugin ${this.plugin.id}`);
                            }

                            // reconnect after
                            Logger.error(`Will reattempt connection to redis server at ${App.get("services.redis.url")} for plugin ${this.plugin.id}`);
                            return 3000;
                        }
                    });

                    _redisClient.on("error", (err) => {
                        Logger.error(`Redis connection for plugin ${this.plugin.id} encountered and error [${err}]`);
                    });

                    _redisClient.on("end", (err) => {
                        isConnected.set(this, false);
                        Logger.error(`Redis connection for plugin ${this.plugin.id} has closed will have to reconnect with next operation`);
                    });

                    _redisClient.on("ready", () => {
                        Logger.info(`Connection to redis server at ${App.get("services.redis.url")} for plugin ${this.plugin.id} succeeded`);
                        redisClient.set(this, _redisClient);
                    });


                    if (this.plugin) {
                        let redisSubscriptionClient = redis.createClient({
                            url: App.get("services.redis.url"),
                            retry_strategy: (options) => {
                                if (options.error && options.error.code === 'ECONNREFUSED') {
                                    // End reconnecting on a specific error and flush all commands with a individual error
                                    Logger.error(`Redis server at ${App.get("services.redis.url")} refused connection for plugin ${this.plugin.id}`);
                                }

                                // reconnect after
                                Logger.error(`Will reattempt connection to redis server at ${App.get("services.redis.url")} refused connection for plugin ${this.plugin.id}`);
                                return 3000;
                            }
                        });
                        redisSubscriptionClient.on("ready", () => {
                            redisSubscriptionClient.subscribe(this.plugin.id);
                            redisSubscriptionClient.on("message", (message) => {
                                this.plugin.onCacheUpdate.call(this.plugin, message);
                            });
                        });
                    }

                    permittedGlobalPrefixes.set(this, this.plugin.package && this.plugin.package.services && this.plugin.package.services.cache ? this.plugin.package.services.cache.permittedGlobalPrefixes : []);
                    isConnected.set(this, true);
                });
        }
    }

    init() {
        return super
            .init()
            .then(() => {
                return this.connect();
            });
    }

    set(key, value, notMine = false) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            }).then(() => {
                return new Promise((resolve, reject) => {
                    this._redisClient.set(this._getKey(key, notMine), JSON.stringify(value), function (err, status) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(value);
                        }
                    });
                });
            });
    }

    get(key, defaultValue = null, notMine = false) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            }).then(() => {

                return new Promise((resolve, reject) => {
                    this._redisClient.get(this._getKey(key, notMine), function (err, value) {
                        if (err) {
                            reject(err);
                        } else {
                            if (value) {
                                value = JSON.parse(value);
                            }
                            resolve(value || defaultValue);
                        }
                    });
                });
            });
    }

    prefix() {
        return `${this.keyPrefix}${Constants.DELIMITER}${this.plugin.id}${Constants.DELIMITER}`;
    }

    _getKey(key, notMine) {
        if (notMine === true) {
            let matchingPrefix = _.find(this.permittedGlobalPrefixes, (prefix) => {
                return key.indexOf(prefix) === 0;
            });
            if (matchingPrefix === undefined) {
                throw `Request key ${key} is not in the permitted global prefixes check services.cache.permittedGlobalPrefixes in the plugin's package.json`;
            }
            return key;
        } else {
            return `${this.prefix()}${key}`;
        }
    }

    del(key, notMine = false) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            }).then(() => {
                return this.get(key, null, notMine).then((value) => {
                    return new Promise((resolve, reject) => {
                        this._redisClient.del(this._getKey(key, notMine), function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(value);
                            }
                        });
                    })
                });
            });
    }

    keys(pattern = "", notMine = false) {
        //Escape all regexes in the prefix
        let prefix = this._getKey(pattern, notMine).replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/'/g, "\\'")
            .replace(/"/g, "\\\"");
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            }).then(() => {
                return new Promise(
                    (resolve, reject) => {
                        this._redisClient.keys(`${prefix}*`, (err, keys) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(keys);
                            }
                        })
                    })
                    .then((keys) => {
                        if (notMine) {
                            return keys;
                        } else {
                            let cachePrefix = this.prefix();
                            return _.compact(_.map(keys, (key) => {
                                return key.indexOf(cachePrefix) === 0 ? key.substring(cachePrefix.length) : null;
                            }));
                        }
                    });
            });
    }
}

module.exports = Cache;