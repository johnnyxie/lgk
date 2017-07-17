const PluginServiceFactory = require("lgk/plugin/services/PluginServiceFactory");
const PluginServiceRegistry = require("lgk/plugin/services/PluginServiceRegistry");


const CacheFactory = require("lgk/plugin/services/cache/CacheFactory");
const MessageSenderFactory = require("lgk/plugin/services/messages/MessageSenderFactory");
const JobManager = require("lgk/plugin/services/jobs/JobManager");
const JobManagerMixin = require("lgk/plugin/services/jobs/JobManagerMixin");

class JobManagerFactory extends PluginServiceFactory {
    createServiceForPlugin(plugin) {
        let cache = CacheFactory.getServiceForPlugin(plugin);
        let pluginMessageSender = MessageSenderFactory.getServiceForPlugin(plugin);
        return new JobManager(plugin, cache, pluginMessageSender);
    }

    getMixin() {
        return JobManagerMixin;
    }
}

module.exports = new JobManagerFactory();
PluginServiceRegistry.register("jobManager", module.exports);
