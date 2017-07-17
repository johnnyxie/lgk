'use strict';

const App = require("lgk/app/App");
const Logger = require("lgk/common/Logger");

//Load all the required services so they will be initialized during plugin load time
require("lgk/plugin/services/cache/CacheFactory");
require("lgk/plugin/services/jobs/JobManagerFactory");
require("lgk/plugin/services/persistence/PersistenceFactory");
require("lgk/plugin/services/messages/MessageReceiverFactory");
require("lgk/plugin/services/logger/PluginLoggerFactory");

require("lgk/plugin/mixin/factory/MessageReceiverMixinFactory");
require("lgk/plugin/mixin/factory/BackgroundJobWorkerMixinFactory");


let moduleLoader = require("lgk/common/ModuleLoader");
moduleLoader.secure();

const PluginLoader = require("lgk/plugin/PluginLoader");
PluginLoader.load();

process.on('uncaughtException', (e) => {
    Logger.error(`We encountered an uncaughtException. ${e}, Stack: ${e.stack}. Will now exit.`);
    process.exit(2);
});

process.on('unhandledRejection', (e) => {
    Logger.error(`We encountered an unhandledRejection. ${e}, Stack: ${e.stack}. Will ignore and continue.`);
});

