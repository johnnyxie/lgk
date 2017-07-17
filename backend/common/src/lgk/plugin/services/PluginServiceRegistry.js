const Promise = require("bluebird");
const _ = require("lodash");

let serviceFactories = {};
exports.register = (serviceName, factory) => {
    serviceFactories[serviceName] = factory;
};

exports.createServicesForPlugin = (plugin) => {
    let services = {};
    for (let serviceName in serviceFactories) {
        services[serviceName] = serviceFactories[serviceName].getServiceForPlugin(plugin);
    }
    return services;
};

exports.init = function () {
    return Promise.each(_.values(serviceFactories), (serviceFactory) => {
        return _.isFunction(serviceFactory.init) ? serviceFactory.init() : false;
    });
};

exports.getMixins = function (serviceNames) {
    if (_.isEmpty(serviceNames)) {
        return _.compact(_.map(serviceFactories, (factory) => {
            return factory.getMixin();
        }));
    } else {
        return _.compact(_.map(serviceNames, (serviceName) => {
            return serviceFactories[serviceName] ? serviceFactories[serviceName].getMixin () : null;
        }));
    }
}