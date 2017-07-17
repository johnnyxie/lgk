const PluginServiceFactory = require("lgk/plugin/services/PluginServiceFactory");
const PluginServiceRegistry = require("lgk/plugin/services/PluginServiceRegistry");

const MessageReceiver = require("lgk/plugin/services/messages/MessageReceiver");
const PluginMessageReceiver = require("lgk/plugin/services/messages/PluginMessageReceiver");

class MessageReceiverFactory extends PluginServiceFactory {

    init() {
        return super
            .init()
            .then(() => {
                return MessageReceiver.init();
            });
    }

    createServiceForPlugin(plugin) {
        return new PluginMessageReceiver(plugin)
    }
}

module.exports = new MessageReceiverFactory();
PluginServiceRegistry.register("messageReceiver", module.exports);
