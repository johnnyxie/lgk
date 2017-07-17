const MessageSenderMixin = require("lgk/plugin/mixin/MessageSenderMixin");
const DefaultMixinFactory = require("lgk/plugin/mixin/factory/DefaultMixinFactory");
const PluginMixinFactoryRegistry = require("lgk/plugin/mixin/PluginMixinFactoryRegistry");

class MessageSenderMixinFactory extends DefaultMixinFactory {
    constructor() {
        super("messageSenderMixin", MessageSenderMixin);
    }
}
PluginMixinFactoryRegistry.register(new MessageSenderMixinFactory());
