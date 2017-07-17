'use strict';

const moduleLoader = require("lgk/common/ModuleLoader");
moduleLoader.secure();

const App = require("lgk/app/App");
App.init(require("./lgk-config-server.json"));

let Server = require("lgk/server/Server");
try {
    new Server()
        .start(false)
        .then((server) => {
            console.log(`Server running at ${server.info.uri}`);
        })
        .catch((e) => {
            console.log(e);
        });
} catch (e) {
    console.log(e);
}
