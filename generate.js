'use strict';

const fs = require("fs");
const config = require("config");
const swig = require("swig");
const App = require("lgk/app/App");
const Logger = require("lgk/common/Logger");

Logger.info("------------------------ Writing NGINX configuration ----------------------");

let nginxConfig = swig.compileFile("./nginx/nginx.conf.swig")({config});
fs.writeFileSync("./nginx/nginx.conf", nginxConfig, 'utf8');

Logger.info("------------------------ Wrote NGINX configuration ----------------------");