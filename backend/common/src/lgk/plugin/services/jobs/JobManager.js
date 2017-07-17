const uuid = require("uuid/v4");
const Constants = require("lgk/common/Constants")
const PluginService = require("lgk/plugin/services/PluginService");
const _ = require("lodash");
const Promise = require ("bluebird");
//Depends on Cache
class JobManager extends PluginService {

    createJob(payload) {
        let jobId = uuid();
        let job = {
            jobId,
            type: Constants.MESSAGE_TYPES.JOB,
            status: Constants.JOB_STATUS.SCHEDULED,
            payload: payload
        };
        return this.plugin.services().cache
            .set(`${this.prefix()}${jobId}`, job)
            .then((job) => {
                return this.plugin.services().messageSender.postMessage(job);
            })
            .then(() => {
                return job;
            });
    }

    prefix() {
        return `jobs${Constants.DELIMITER}`;
    }

    jobs() {
        //iterate over all keys created by this plugin with the name starting with job and return them
        return this.plugin.services().cache
            .keys()
            .then((keys) => {
                return _.compact(_.map(keys, (key) => {
                    return key.indexOf(this.prefix()) === 0 ? key.substring(this.prefix().length) : null;
                }));
            });
    }

    get(jobId) {
        return this.plugin.services().cache.get(`${this.prefix()}${jobId}`);
    }

    //All keys that have the same job prefix
    getJobKeys(jobId) {
        //iterate over all keys created by this plugin with the name starting with job and return them
        let prefix = `${this.prefix()}${jobId}`;
        return this.plugin.services().cache
            .keys(prefix)
            .then((keys) => {
                return _.compact(_.map(keys, (key) => {
                    return key.indexOf(prefix) === 0 ? key : null;
                }));
            });
    }

    update(jobId, updatedJob) {
        return this
            .get(jobId)
            .then((job) => {
                if (_.isEmpty(job)) {
                    return false;
                }
                return this.plugin.services().cache.set(`${this.prefix()}${jobId}`, _.merge(job, updatedJob));
            });
    }

    del(jobId) {
        let returnValue = null;
        return this.get(jobId).then((job) => {
            if (_.isEmpty(job)) {
                return false;
            } else {
                returnValue = job;
                return this.getJobKeys(jobId);
            }
        }).then((keys) => {
            if (keys === false) {
                return false;
            }
            return Promise.each(keys, (key) => {
                return this.plugin.services().cache.del(key);
            })
        }).then(() => {
            return returnValue;
        });
    }
}

module.exports = JobManager;