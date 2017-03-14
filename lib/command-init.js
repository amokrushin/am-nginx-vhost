const Nginx = require('./Nginx');
const config = require('../defaults.json');

// eslint-disable-next-line
const logger = console.log;
const nginx = new Nginx({ logger });

exports.builder = {};

exports.handler = () => {
    nginx.includeAdd('letsencrypt.conf', { webroot: config.letsencrypt.webroot });
};
