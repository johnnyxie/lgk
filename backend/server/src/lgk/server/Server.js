'use strict';

const Promise = require("bluebird");
const crypto = require("crypto");
const fs = require("fs");
const _ = require("lodash");
const pluginLoader = require("lgk/plugin/PluginLoader");
const Hapi = require('hapi');
const App = require("lgk/app/App");
const path = require('path');
const redis = require("redis");
const Logger = require("lgk/common/Logger");
const WebServerMixin = require("lgk/plugin/mixin/WebServerMixin");
const Boom = require("boom");

class Server {
    constructor() {
        //Create a server with a host and port
        const server = new Hapi.Server();

        server.connection({
            host: App.get("nodeJS.host"),
            port: App.get("nodeJS.port"),
            routes: {
                cors: true
            }
        });

        const logOptions = {
            ops: {
                interval: App.get("logs.operationsMonitoringInterval")
            },
            includes: {
                request: ["headers", "payload"],
                response: ["payload"],
            },
            reporters: {
                ops: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ops: '*', separator: '\n'}]
                }, {
                    module: 'good-squeeze',
                    name: 'SafeJson'
                }, {
                    module: 'good-file',
                    args: [App.get("logs.nodeJS.operationalMonitoringLog")]
                }],
                requestResponse: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [App.get("logs.requestResponse.collect")]
                }, {
                    module: 'good-squeeze',
                    name: 'SafeJson'
                }, {
                    module: 'rotating-file-stream',
                    args: [App.get("logs.requestResponse.log"), {
                        path: App.get("logs.requestResponse.path"), // base path
                        size: '10M', // rotate every 10 MegaBytes written
                        interval: '1d'
                    }]
                }],
                winston: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{log: '*', request: '*', separator: '\n'}]
                }, {
                    module: 'good-squeeze',
                    name: 'SafeJson'
                }, {
                    module: 'good-winston',
                    args: [Logger]
                }]
            }
        };

        server.register({
            register: require('good'),
            options: logOptions,
        }, (err) => {
            if (err) {
                return Logger.error(err);
            }
        });
        server.register({
            "register": require('nes'),
            "options": {
                heartbeat: {
                    interval: App.get("nodeJS.websocket.heartbeat.interval"),
                    timeout: App.get("nodeJS.websocket.heartbeat.timeout"),
                },
                onConnection: (socket) => {
                    this.onWebSocketConnected(socket);
                },

                onDisconnection: (socket) => {
                    this.onWebSocketDisconnected(socket);
                }
            }
        });

        this.server = server;
    }

    start() {
        return this
            .registerPlugins()
            .then(() => {
                this.server.start();
                return this.server;
            });
    }

    stop() {
        this.server.stop();
    }

    registerPlugins() {
        return pluginLoader
            .load()
            .then(() => {
                return Promise.each(pluginLoader.plugins(), (plugin) => {
                    return Promise
                        .resolve(plugin)
                        .then((plugin) => {
                            Logger.info(`Loading plugin ${plugin.package.name}`);
                            if (plugin instanceof WebServerMixin) {
                                if (plugin.package.internal) {
                                    return plugin.registerRoutes(this.server);
                                } else {
                                    return new Promise((resolve, reject) => {

                                        let registerProxy = (server, options, next) => {

                                            let pluginSubscriptions = [];

                                            let serverProxy = {
                                                route: (json) => {
                                                    json.path = plugin.apiPrefix + (json.path[0] === "/" ? "" : "/") + json.path;
                                                    server.route(json);
                                                },
                                                subscription: (path, options) => {
                                                    pluginSubscriptions.push(path);
                                                    if (path) {
                                                        path = plugin.apiPrefix + (path[0] === "/" ? path : "/" + path);
                                                    }
                                                    server.subscription(path, options);
                                                },
                                                publish: (path, message, options) => {
                                                    if (path) {
                                                        path = plugin.apiPrefix + (path[0] === "/" ? path : "/" + path);
                                                    }
                                                    server.publish(path, message, options);
                                                },
                                                eachSocket: (fn, options) => {
                                                    if (!options || !options.subscription || pluginSubscriptions.indexOf(options.subscription) === -1) {
                                                        throw `Invalid iteration for each socket, path requested not within the subscriptions`;
                                                    }
                                                    options = Object.assign({}, options);
                                                    options.subscription = plugin.apiPrefix + (options.subscription[0] === "/" ? options.subscription : "/" + options.subscription);
                                                    server.eachSocket((socket) => {
                                                        fn(socket);
                                                    }, options);
                                                }
                                            };

                                            plugin
                                                .registerRoutes(serverProxy, options)
                                                .then(() => {
                                                    next();
                                                });
                                        };
                                        registerProxy.attributes = plugin.package;
                                        this.server.register(
                                            {
                                                "register": registerProxy,
                                                "options": {}
                                            }, (err) => {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    resolve(plugin);
                                                }
                                            });
                                    });
                                }
                            }
                        })
                        .catch((e) => {
                            Logger.error(`Plugin ${plugin.name} loading failed.`);
                            Logger.error(e.message || e);
                            Logger.error(e.stack);
                        });
                });
            });
    }

    onWebSocketConnected(socket) {
        Logger.info(`A new web socket connected. ${socket.id}`);
        this.callMixinMethod("onWebSocketConnected", [socket]);
    }

    onWebSocketDisconnected(socket) {
        Logger.info(`A web socket disconnected. ${socket.id}`);
        this.callMixinMethod("onWebSocketDisconnected", [socket]);
    }

    callMixinMethod(methodName, methodArguments) {
        for (let plugin of pluginLoader.plugins()) {
            if (plugin instanceof WebServerMixin) {
                if (_.isFunction(plugin[methodName])) {
                    try {
                        plugin[methodName].apply(plugin, methodArguments);
                    } catch (e) {
                        Logger.error(`${plugin.id} threw an exception in ${methodName}. Exception [${e}], Stack[${e.stack}]`);
                    }
                }
            }
        }
    }

}

module.exports = Server;