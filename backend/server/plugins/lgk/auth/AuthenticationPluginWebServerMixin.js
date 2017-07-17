'use strict';
const Joi = require('joi');
const Boom = require('boom');
const tmp = require('tmp-promise');
const exec = require('child_process').exec;
const Promise = require("bluebird");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const _ = require("lodash");
const WebServerMixin = require("lgk/plugin/mixin/WebServerMixin");
const App = require("lgk/app/App");
const path = require("path");

class AuthenticationPluginWebServerMixin extends WebServerMixin {

    registerRoutes(server) {
        return super
            .registerRoutes(server)
            .then(() => {
                let register = (server) => {
                    this.registerAuthenticationRoutes(server);
                };
                register.attributes = this.package;

                server.register({
                    register: register,
                    options: {}
                }, {
                    routes: {
                        prefix: this.apiPrefix
                    }
                }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(plugin);
                    }
                });
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    server.register(require('hapi-auth-jwt2'), {}, (err) => {
                        if (err) {
                            reject(false);
                        } else {
                            server.auth.strategy('jwt', 'jwt', false,
                                {
                                    headerKey: "jwt",
                                    key: server.app.encryptionKey,
                                    validateFunc: (decoded, request, callback) => {
                                        try {
                                            let credentials = JSON.parse(this.decode(decoded.credentials));
                                            return callback(null, true, credentials);
                                        } catch (e) {
                                        }
                                        return callback(null, false);
                                    },
                                    verifyOptions: {
                                        ignoreExpiration: false,
                                        algorithms: ['HS256']
                                    }
                                });
                            resolve();
                        }
                    });
                });
            });
    };

    registerAuthenticationRoutes(server) {
        server.route({
            method: 'GET',
            path: '/organization',
            handler: function (request, reply) {
                var result = {
                    type: 'entity',
                    data: [{
                        name: 'Palo Alto Networks'
                    }]
                };
                reply(result);
            }
        });

        server.route({
            method: 'GET',
            path: '/authenticate',
            handler: function (request, reply) {
                var username = request.query.username;
                var password = request.query.password;
                var user = {
                    name: username,
                    password: password
                };
                reply(user);
            }
        });

    }
}

module.exports = AuthenticationPluginWebServerMixin;
