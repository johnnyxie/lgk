'use strict';

const glob = require("glob-promise");
const path = require('path');
const fs = require('fs');
const _ = require("lodash");
const App = require("lgk/app/App");
const Promise = require("bluebird");
const Logger = require("lgk/common/Logger");
const mixins = require('lgk/common/Mixins');

const PluginServiceRegistry = require("lgk/plugin/services/PluginServiceRegistry");
const Plugin = require("lgk/plugin/Plugin");
const PluginMixinFactoryRegistry = require("lgk/plugin/mixin/PluginMixinFactoryRegistry");

class PluginLoader {

    constructor() {
        this._plugins = [];
    }

    load(config) {

        return PluginServiceRegistry
            .init()
            .then(() => {
                return glob(`${App.get("plugins.dir")}/**/package.json`)
            })
            .then((files) => {
                Logger.info("-----------------------Loading plugins-----------------------");
                return Promise.each(files, (file) => {
                    return Promise.resolve(file)
                        .then((file) => {
                            Logger.info(`Inspecting plugin file ${file}`);
                            let dir = path.dirname(path.resolve(path.normalize(file)));
                            let pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
                            pkg.dir = dir;
                            return pkg;
                        }).then((pkg) => {
                            pkg.modules = {};
                            if (pkg.paths && _.isObject(pkg.paths)) {
                                _.each(pkg.paths, (file, name) => {
                                    let dir = pkg.dir;
                                    let filePath = dir + "/" + file;
                                    if (path.normalize(filePath).indexOf(dir) !== 0) {
                                        throw `Plugin is trying to include a file not within its directory ${file}`;
                                    }
                                    pkg.modules [name] = {
                                        filePath,
                                        module: require(filePath)
                                    };
                                });
                            }
                            return pkg;
                        }).then((pkg) => {
                            let pluginMixins = [].concat(PluginMixinFactoryRegistry.getMixinsFor(pkg), PluginServiceRegistry.getMixins(), Plugin);
                            pluginMixins = _.compact(pluginMixins);
                            let plugin = new (class extends mixins.apply(null, pluginMixins) {
                            });
                            plugin.class(Plugin).initializePlugin.call(plugin, pkg);
                            return Promise.each(_.reverse(pluginMixins), (pluginMixin) => {
                                return plugin.class(pluginMixin).init ? plugin.class(pluginMixin).init.call(plugin) : Promise.resolve(true);
                            }).then(() => {
                                return plugin;
                            });
                        }).then((plugin) => {
                            let services = PluginServiceRegistry.createServicesForPlugin(plugin);
                            return Promise
                                .each(_.keys(services), (serviceName) => {
                                    return services[serviceName].init();
                                })
                                .then(() => {
                                    let frozenServices = {};
                                    _.each(services, (service, serviceName) => {
                                        frozenServices[serviceName] = Object.freeze(service);
                                    });
                                    plugin.class(Plugin).services.call(plugin, frozenServices);
                                    return plugin;
                                });
                        }).then((plugin) => {
                            return plugin
                                .init()
                                .then(() => {
                                    return plugin;
                                });
                        }).then((plugin) => {
                            this._plugins.push(Object.freeze(plugin));
                            return true;
                        })
                        .catch((e) => {
                            console.log(`Plugin ${file} loading failed.`)
                            console.log(e.message || e);
                            console.log(e.stack);
                        });
                });
            });
    }

    isAccessible(requestingPlugin, requestedPath) {
        return true;
    }

    plugins() {
        return this._plugins;
    }
}

module
    .exports = new PluginLoader();