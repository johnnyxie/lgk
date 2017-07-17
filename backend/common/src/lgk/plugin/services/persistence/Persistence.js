const Promise = require("bluebird");
const _ = require("lodash");
const MongoClient = require('mongodb').MongoClient;
const App = require("lgk/app/App");
const PluginService = require("lgk/plugin/services/PluginService");
const Logger = require("lgk/common/Logger");

const isConnected = new WeakMap();
const collection = new WeakMap();

class Persistence extends PluginService {

    get connected() {
        return isConnected.get(this);
    }

    get mongoCollection() {
        return collection.get(this);
    }

    connect() {
        if (this.connected) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(true)
                .then(() => {
                    Logger.info(`Connecting to mongodb at ${App.get("services.mongodb.url")} for plugin ${this.plugin.id}`);
                    return MongoClient.connect(App.get("services.mongodb.url"),
                        {
                            reconnectTries: 1000,
                            reconnectInterval: 3000,
                            loggerLevel: "info"
                        });
                })
                .then((db) => {
                    db.on("close", () => {
                        isConnected.set(this, false);
                        Logger.error(`Database connection for plugin ${this.plugin.id} has closed will have to reconnect with next operation`);
                    });
                    return db.collection(this.plugin.id);
                })
                .then((dbCollection) => {
                    collection.set(this, dbCollection);
                    isConnected.set(this, true);
                });
        }
    }

    init() {
        return super
            .init()
            .then(() => {
                return this.connect();
            });
    }

    set(key, value) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            })
            .then(() => {
                return this.mongoCollection.update({_id: key}, {_id: key, key, value}, {upsert: true});
            }).then(() => {
                return value;
            });
    }

    get(key, defaultValue = null) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            })
            .then(() => {
                return this.mongoCollection.findOne({_id: key});
            }).then((record) => {
                return record && record.value ? record.value : defaultValue;
            });
    }

    find(query = {}) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            })
            .then(() => {
                return this.mongoCollection.find(query);
            }).then((cursor) => {
                return cursor ?
                    {
                        hasNext: cursor.hasNext.bind(cursor),
                        forEach: cursor.forEach.bind(cursor),
                        next: cursor.next.bind(cursor)
                    }
                    : Promise.resolve({
                        hasNext: Promise.resolve(false),
                        forEach: (iterator, end) => {
                            end();
                        },
                        next: Promise.resolve(null),
                    });
            });
    }

    del(key) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            })
            .then(() => {
                return this.mongoCollection.deleteOne({_id: key});
            });

    }

    deleteUsing(criteria = {}) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            })
            .then(() => {
                if (!_.isEmpty(criteria)) {
                    return this.mongoCollection.deleteMany(criteria);
                }
            });
    }

    values(predicate = (doc) => {
        return true;
    }) {
        return Promise
            .resolve(true)
            .then(() => {
                if (this.connected) {
                    return true;
                } else {
                    return this.connect();
                }
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    let values = [];
                    this.mongoCollection.find().forEach((doc) => {
                        try {
                            let keyValue = {
                                "key": doc.key,
                                "value": doc.value
                            };
                            if (predicate(keyValue)) {
                                values.push(keyValue);
                            }
                        } catch (e) {
                        }
                    }, () => {
                        resolve(_.compact(values));
                    });
                });
            });
    }

    keys() {
        return values()
            .then((values) => {
                return _.map(values, (value) => {
                    return value.key;
                });
            });
    }
}

module.exports = Persistence;