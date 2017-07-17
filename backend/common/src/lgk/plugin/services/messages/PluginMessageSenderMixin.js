const Promise = require("bluebird");
const Constants = require ("lgk/common/Constants");

class PluginMessageSenderMixin {
    onGeneralMessage(message) {
        return Promise.resolve(message);
    }

    onMessage(message) {
        if (message.type === Constants.MESSAGE_TYPES.JOB) {
            return this.onJobUpdate(message);
        } else {
            return this.onGeneralMessage(message);
        }
    }
}

module.exports = PluginMessageSenderMixin;