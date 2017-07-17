const MessageSender = require("lgk/plugin/services/messages/MessageSender");
const PluginService = require("lgk/plugin/services/PluginService");
const MessageSenderMixin = require("lgk/plugin/mixin/MessageSenderMixin");
const _ = require("lodash");

class PluginMessageSender extends PluginService {

    init() {
        return super
            .init()
            .then(() => {
                MessageSender.register(this.plugin, this);
            });
    }

    postMessage(message, options = {broadcast: false}, requestMessageProperties = null) {
        return MessageSender.postMessage(this.plugin, message, options, requestMessageProperties);
    }

    onMessage(message, messageProperties) {
        return Promise
            .resolve(true)
            .then(() => {
                if (this.plugin instanceof MessageSenderMixin) {
                    return this.plugin.onMessageFromSendQ.call(this.plugin, message, messageProperties);
                }
            });
    }
}
module.exports = PluginMessageSender;
