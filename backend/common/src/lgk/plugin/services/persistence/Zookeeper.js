const zookeeper = require('node-zookeeper-client');
const App = require("lgk/app/App");
const _ = require("lodash");

class Zookeeper {
    constructor() {
    }

    init() {
        return new Promise((resolve, reject) => {
            let zk = zookeeper.createClient(App.get("zookeeper.server"));
            zk.connect();
            this._client = zk;
        });
    }

    watch(path, callback) {
        return this
            .exists(path)
            .then((exists) => {
                if (exists) {
                    return new Promise((resolve, reject) => {
                        this._client.getData(path, (event) => {
                            callback.call(this, event);
                        });
                    })
                } else {
                    return new Promise((resolve, reject) => {
                        resolve(null);
                    });
                }
            });
    }

    exists(path) {
        return new Promise((resolve, reject) => {
            this._client.exists(path, null, function (error, stat) {
                if (error) {
                    reject(error);
                    return;
                }
                if (stat) {
                    resolve(true, path);
                } else {
                    resolve(false, path);
                }
            })
        });
    }

    set(path, object) {
        return this
            .exists(path)
            .then((exists) => {
                if (exists) {
                    return new Promise((resolve, reject) => {
                        this._client.setData(path, new Buffer(JSON.stringify(object)), -1, function (error, stat) {
                            if (error) {
                                reject(error);
                                return;
                            }
                            resolve(path, object);
                        });
                    })
                } else {
                    return new Promise((resolve, reject) => {
                        this._client.mkdirp(
                            path,
                            new Buffer(JSON.stringify(object)),
                            null,
                            zookeeper.CreateMode.PERSISTENT,
                            function (error, path) {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                resolve(path, object);
                            }
                        );
                    });
                }
            });
    }

    get(path) {
        return this
            .exists(path)
            .then((exists) => {
                if (exists) {
                    return new Promise((resolve, reject) => {
                        this._client.getData(path, null, function (error, data, stat) {
                            if (error) {
                                reject(error);
                                return;
                            }
                            resolve(JSON.parse(data), path);
                        });
                    })
                } else {
                    return new Promise((resolve, reject) => {
                        resolve(null);
                    });
                }
            });
    }

    remove(path) {
        return new Promise((resolve, reject) => {
            this._client.remove(path, -1, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true, path);
                }
            });
        });
    }
}

module.exports = new Zookeeper();
