const DefaultMixinFactory = require("lgk/plugin/mixin/factory/DefaultMixinFactory");
const WebServerMixin = require("lgk/plugin/mixin/WebServerMixin");
const PluginMixinFactoryRegistry = require("lgk/plugin/mixin/PluginMixinFactoryRegistry");

class WebServerMixinFactory extends DefaultMixinFactory {
    constructor() {
        super("webServerMixin", WebServerMixin);
    }
}

PluginMixinFactoryRegistry.register(new WebServerMixinFactory());
