const App = require("lgk/app/App");
const winston = require("winston");
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
    filename: App.get("logs.nodeJS.serverLog"), // this path needs to be absolute
    colorize: false,
    datePattern: '.yyyy-MM-dd.log',
    json: false,
    prettyPrint: true,
    silent: false
});

let logger = new (winston.Logger)({
    levels: winston.config.syslog.levels,
    colors: winston.config.syslog.colors,
    transports: [
        transport
    ]
});

module.exports = logger;