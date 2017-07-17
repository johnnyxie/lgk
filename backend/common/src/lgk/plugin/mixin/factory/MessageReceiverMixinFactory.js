const MessageReceiverMixin = require("lgk/plugin/mixin/MessageReceiverMixin");
const DefaultMixinFactory = require("lgk/plugin/mixin/factory/DefaultMixinFactory");
const PluginMixinFactoryRegistry = require("lgk/plugin/mixin/PluginMixinFactoryRegistry");

class MessageReceiverMixinFactory extends DefaultMixinFactory {
    constructor() {
        super("messageReceiverMixin", MessageReceiverMixin);
    }
}
PluginMixinFactoryRegistry.register(new MessageReceiverMixinFactory());
