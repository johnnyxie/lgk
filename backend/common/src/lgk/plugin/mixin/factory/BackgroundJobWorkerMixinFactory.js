const DefaultMixinFactory = require("lgk/plugin/mixin/factory/DefaultMixinFactory");
const BackgroundJobWorkerMixin = require("lgk/plugin/mixin/BackgroundJobWorkerMixin");
const PluginMixinFactoryRegistry = require("lgk/plugin/mixin/PluginMixinFactoryRegistry");

class BackgroundJobWorkerMixinFactory extends DefaultMixinFactory {
    constructor() {
        super("backgroundJobWorkerMixin", BackgroundJobWorkerMixin);
    }
}

PluginMixinFactoryRegistry.register(new BackgroundJobWorkerMixinFactory());
