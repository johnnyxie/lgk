const uuid = require('uuid/v4');
const amqp = require('amqplib/callback_api');
const domain = require('domain');
const Promise = require('bluebird');
const _ = require("lodash");
const App = require("lgk/app/App");
const Logger = require("lgk/common/Logger");

class MessageSender {

    constructor() {
        this._registry = {};
        this._isConnected = false;
        this._channel = null;
        this.eventListener = domain.create();
        this.eventListener.on('error', (e, stack) => {
            this._isConnected = false;
            Logger.error(`Connection to RabbitMQ on ${App.get("services.rabbitMQ.url")} failed, next call will need reconnection`);
        });
    }

    connect() {
        if (this._isConnected) {
            return Promise.resolve(true);
        } else {
            return Promise
                .resolve(true)
                .then(() => {
                    return new Promise((resolve, reject) => {
                        Logger.info(`Connecting to RabbitMQ on ${App.get("services.rabbitMQ.url")}`);
                        amqp.connect(`${App.get("services.rabbitMQ.url")}`, (err, connection) => {
                            if (err) {
                                Logger.info(`Connection to RabbitMQ on ${App.get("services.rabbitMQ.url")} failed with error ${err}`);
                                this._isConnected = false;
                                reject(err);
                            } else {
                                connection.on("error", () => {
                                    this._isConnected = false;
                                    Logger.error(`Connection to RabbitMQ on ${App.get("services.rabbitMQ.url")} encountered an error, next call will need reconnection`);
                                });
                                connection.on("close", () => {
                                    this._isConnected = false;
                                    Logger.error(`Connection to RabbitMQ on ${App.get("services.rabbitMQ.url")} closed, next call will need reconnection`);
                                });
                                connection.createChannel((err, channel) => {
                                    if (err) {
                                        Logger.info(`Channel creation on RabbitMQ at ${App.get("services.rabbitMQ.url")} failed with error ${err}`);
                                        reject(err);
                                    } else {
                                        //Direct
                                        channel.assertExchange(this._directExchangeName, 'direct', {durable: true});

                                        channel.assertQueue(this._requestQName, {durable: true});
                                        channel.bindQueue(this._requestQName, this._directExchangeName, '');

                                        channel.assertQueue(this._replyQName, {durable: true});
                                        channel.bindQueue(this._replyQName, this._directExchangeName, '');

                                        channel.consume(this._replyQName, (message) => {
                                            this._onMessage(message);
                                        });
                                        this._channel = channel;
                                        resolve(channel);
                                    }
                                });
                            }
                        });
                    });
                }).then((channel) => {
                    return new Promise((resolve, reject) => {
                        channel.assertExchange(this._fanoutRequestExchangeName, 'fanout', {durable: false});
                        channel.assertExchange(this._fanoutReplyExchangeName, 'fanout', {durable: false});
                        channel.assertQueue('', {exclusive: true, durable: false}, (err, q) => {
                            if (err) {
                                Logger.error(`Creation of fanout queues on exchange ${this._fanoutReplyExchangeName} failed for RabbitMQ at ${App.get("services.rabbitMQ.url")}`);
                                reject(err);
                            } else {
                                this._fanoutReplyQueue = q.queue;
                                channel.bindQueue(this._fanoutReplyQueue, this._fanoutReplyExchangeName, '');
                                channel.consume(this._fanoutReplyQueue, (message) => {
                                    this._onMessage(message);
                                });
                                this._isConnected = true;
                                Logger.info(`Successfully connected to RabbitMQ on ${App.get("services.rabbitMQ.url")}`)
                                resolve(this);
                            }
                        });
                    });
                });
        }
    }

    init() {
        return Promise
            .resolve(true)
            .then(() => {
                this._requestQName = App.get("services.rabbitMQ.requestQ");
                this._replyQName = App.get("services.rabbitMQ.replyQ");

                this._fanoutRequestExchangeName = App.get("services.rabbitMQ.fanoutRequestExchangeName");
                this._fanoutReplyExchangeName = App.get("services.rabbitMQ.fanoutReplyExchangeName");

                this._directExchangeName = App.get("services.rabbitMQ.directExchangeName");
            }).then(() => {
                return this.connect();
            });
    }

    register(plugin, pluginSender) {
        this._registry[plugin.id] = pluginSender;
    }

    postMessage(plugin, message, options = {broadcast: false}, properties = null) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            }).then(() => {
                if (options.broadcast === true) {
                    try {
                        this._channel.publish(this._fanoutRequestExchangeName, '', new Buffer(JSON.stringify(message)), {
                            messageId: uuid(),
                            appId: plugin.id,
                            correlationId: properties ? properties.messageId : null
                        });
                    } catch (e) {
                        Logger.error(`Could not publish message to RabbitMQ on ${App.get("services.rabbitMQ.url")} to Q ${this._fanoutRequestExchangeName}. Message [${JSON.stringify(message)}] for plugin ${plugin.id}.`);
                    }
                } else {
                    try {
                        this._channel.sendToQueue(this._requestQName, new Buffer(JSON.stringify(message)), {
                            persistent: true,
                            messageId: uuid(),
                            appId: plugin.id,
                            correlationId: properties ? properties.messageId : null,
                            replyTo: this._replyQName
                        });
                    } catch (e) {
                        Logger.error(`Could not send message to RabbitMQ on ${App.get("services.rabbitMQ.url")} to Q ${this._requestQName}. Message [${JSON.stringify(message)}] for plugin ${plugin.id}.`);
                    }
                }
                return message;
            });
    }

    _onMessage(message) {
        return Promise
            .resolve(true)
            .then(() => {
                return this.connect();
            }).then(() => {
                if (message.properties.appId && this._registry[message.properties.appId]) {
                    let content = JSON.parse(message.content.toString());
                    try {
                        this._registry[message.properties.appId].onMessage(content, message.properties);
                    } catch (e) {
                        Logger.error(`Could not send message to plugin ${message.properties.appId}. Message [${message.content.toString()}]`);
                    }
                }
            }).then(() => {
                return this._channel.ack(message);
            });
    }
}

module.exports = new MessageSender();

