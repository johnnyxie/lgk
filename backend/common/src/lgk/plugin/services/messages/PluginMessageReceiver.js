const PluginService = require("lgk/plugin/services/PluginService");
const MessageReceiver = require("lgk/plugin/services/messages/MessageReceiver");
const MessageReceiverMixin = require("lgk/plugin/mixin/MessageReceiverMixin");
const BackgroundJobWorkerMixin = require("lgk/plugin/mixin/BackgroundJobWorkerMixin");
const Promise = require("bluebird");
const Constants = require("lgk/common/Constants");

class PluginMessageReceiver extends PluginService {

    init() {
        return super
            .init()
            .then(() => {
                MessageReceiver.register(this.plugin, this);
            });
    }

    postMessage(message, options = {broadcast: false}, requestMessageProperties = null) {
        return MessageReceiver._postMessage(this.plugin, message, options, requestMessageProperties);
    }

    onMessage(message, messageProperties) {
        return Promise
            .resolve(true)
            .then(() => {
                if (this.plugin instanceof MessageReceiverMixin) {
                    return this.plugin.onMessageFromReceiveQ.call(this.plugin, message, messageProperties);
                }
            })
            .then(() => {
                if (message.type === Constants.MESSAGE_TYPES.JOB) {
                    if (this.plugin instanceof BackgroundJobWorkerMixin) {
                        return this.plugin.onJobUpdate.call(this.plugin, message, messageProperties);
                    }
                }
            });
    }
}
module.exports = PluginMessageReceiver;

