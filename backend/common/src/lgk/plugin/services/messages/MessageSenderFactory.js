const PluginServiceFactory = require("lgk/plugin/services/PluginServiceFactory");
const PluginServiceRegistry = require("lgk/plugin/services/PluginServiceRegistry");

const MessageSender = require("lgk/plugin/services/messages/MessageSender");
const PluginMessageSender = require("lgk/plugin/services/messages/PluginMessageSender");
const PluginMessageSenderMixin = require("lgk/plugin/services/messages/PluginMessageSenderMixin");

class MessageSenderFactory extends PluginServiceFactory {
    init() {
        return super
            .init()
            .then(() => {
                return MessageSender.init();
            });
    }

    getMixin () {
        return PluginMessageSenderMixin;
    }

    createServiceForPlugin(plugin) {
        return new PluginMessageSender(plugin)
    }
}

module.exports = new MessageSenderFactory();
PluginServiceRegistry.register("messageSender", module.exports);
