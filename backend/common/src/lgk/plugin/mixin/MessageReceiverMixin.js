const PluginMixin = require("lgk/plugin/mixin/PluginMixin");
const Logger = require("lgk/common/Logger");

class MessageReceiverMixin extends PluginMixin {
    onMessageFromReceiveQ(message, messageProperties) {
    }
}

module.exports = MessageReceiverMixin;