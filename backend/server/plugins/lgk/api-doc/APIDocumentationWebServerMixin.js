const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Promise = require("bluebird");
const WebServerMixin = require("lgk/plugin/mixin/WebServerMixin");
const App = require("lgk/app/App");


class APIDocumentationWebServerMixin extends WebServerMixin {

    registerRoutes(server, options) {
        return super.registerRoutes(server, options).then(() => {
            const docOptions = {
                info: {
                    'title': 'API Documentation',
                    'version': this.package.version,
                },
                "host": `${App.get('nginx.host')}:${App.get('nginx.httpsPort')}`,
                "schemes": ["https"],
                "basePath": "/api/",
                "swaggerUIPath": "/api/swaggerui/",
                "jsonPath": "/api/swaggerui/swagger.json"
            };

            return new Promise((resolve, reject) => {
                server.register([
                    Inert,
                    Vision,
                    {
                        'register': HapiSwagger,
                        'options': docOptions
                    }], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            });
        });
    }
}

module.exports = APIDocumentationWebServerMixin;