const Promise = require("bluebird");
const _ = require("lodash");

let mixinFactories = [];
exports.register = (mixinFactory) => {
    mixinFactories.push(mixinFactory);
};

exports.init = function () {
    return Promise.each(mixinFactories, (mixinFactory) => {
        return _.isFunction(mixinFactory.init) ? mixinFactory.init() : false;
    });
};

exports.getMixinsFor = function (plugin) {
    let mixins = [];
    _.each(mixinFactories, (mixinFactory) => {
        mixins.push(mixinFactory.getMixinsFor(plugin));
    });

    return _.uniq(
        _.flattenDeep(
            _.compact(mixins)
        )
    );
};
