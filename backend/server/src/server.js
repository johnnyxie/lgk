'use strict';

const Logger = require("lgk/common/Logger");
const App = require("lgk/app/App");

//Load all the reuired services so they will be initialized during plugin load time
//Services
require("lgk/plugin/services/persistence/PersistenceFactory");
require("lgk/plugin/services/cache/CacheFactory");
require("lgk/plugin/services/jobs/JobManagerFactory");
require("lgk/plugin/services/messages/MessageSenderFactory");
require("lgk/plugin/services/logger/PluginLoggerFactory");

//Mixins
require("lgk/plugin/mixin/factory/WebServerMixinFactory");
require("lgk/plugin/mixin/factory/MessageSenderMixinFactory");

Logger.info("Intializing API Server");

let moduleLoader = require("lgk/common/ModuleLoader");
moduleLoader.secure();

Logger.info("------------------------ Starting NodeJS Server ----------------------");

let Server = require("lgk/server/Server");
try {
    new Server()
        .start(false)
        .then((server) => {
            Logger.info(`Server running at ${server.info.uri}`);
        })
        .catch((e) => {
            Logger.error(e);
        });
} catch (e) {
    console.log(e);
}

process.on('uncaughtException', (e) => {
    let message = `We encountered an uncaughtException. ${e}, Stack: ${e.stack}. Will now exit.`;
    console.log (message);
    Logger.error(message);
    process.exit(2);
});

process.on('unhandledRejection', (e) => {
    let message = `We encountered an unhandledRejection. ${e}, Stack: ${e.stack}. Will ignore and continue.`;
    Logger.error(message);
    console.log (message);
});

process.on('exit', (code) => {
    let message = `NodeJS process exiting with code ${code}`;
    console.log (message);
    Logger.error(message);
});
