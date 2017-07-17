const axios = require("axios");
const _ = require("lodash");
const Zookeeper = require("lgk/persistence/Zookeeper");
const Boom = require("boom");

exports.register = function (server, options, next) {
    Zookeeper.init();
    server.subscription("/watch/{path}", {
        auth: {
            mode: "required",
            entity: "user",
            index: true
        }
    });

    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: function (request, reply) {
            Zookeeper.get(`/${request.params.path}`).then((data) => {
                reply({result: data});
            }).catch((err) => {
                reply(Boom.internal(err))
            });
        }
    });

    server.route({
        method: 'DELETE',
        path: '/{path*}',
        handler: function (request, reply) {
            Zookeeper.delete(`/${request.params.path}`).then((data) => {
                reply({result: data});
            }).catch((err) => {
                reply(Boom.internal(err))
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/{path*}',
        handler: function (request, reply) {
            Zookeeper.set(`/${request.params.path}`, request.payload).then((data) => {
                reply({result: data});
            }).catch((err) => {
                reply(Boom.internal(err))
            });
        }
    });

    server.route({
        method: 'WATCH',
        path: '/{path*}',
        handler: function (request, reply) {
            server.subscription(`/watch/${request.params.path}`, {
                auth: {
                    mode: "required",
                    entity: "user",
                    index: true
                }
            });
            Zookeeper.watch(request.params.path, (data, path) => {
                server.publish(`/watch/${request.params.path}`, data);
            }).catch((err) => {
                reply(Boom.internal(err))
            });
            reply({result: true});
        }
    });


};


exports.register.attributes = {
    pkg: require('./package.json')
};
