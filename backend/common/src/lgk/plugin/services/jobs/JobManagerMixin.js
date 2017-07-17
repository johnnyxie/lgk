class JobManagerMixin {

    onJobUpdate(message) {
        return this.services().jobManager.update(message.jobId, message);
    }

    getJob(jobId) {
        return this.services().jobManager.get(jobId);
    }

    getJobs(jobId) {
        return this.services().jobManager.keys(jobId).then((keys) => {
            return Promise.each(keys, (key) => {
                return this.services().cache.get(key);
            });
        });
    }

    createJob(payload = {}) {
        return this.services().jobManager.createJob(payload);
    }

}

module.exports = JobManagerMixin;