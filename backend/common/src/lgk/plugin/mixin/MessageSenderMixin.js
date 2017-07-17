const PluginMixin = require("lgk/plugin/mixin/PluginMixin");

class MessageSenderMixin extends PluginMixin {
    onMessageFromSendQ(message, messageProperties) {
        return Promise.resolve(true);
    }
}

module.exports = MessageSenderMixin;