const Nginx = require('./Nginx');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const shell = require('shelljs');

// eslint-disable-next-line
const logger = console.log;
const nginx = new Nginx({ logger });
const { LETSENCRYPT_WEBROOT } = process.env;

exports.builder = {};

exports.handler = () => {
    const envFilePath = path.resolve(os.homedir(), '.am-nginx-vhost.env');
    const envDefaultFilePath = path.resolve(__dirname, '../defaults.env');
    if (!fs.existsSync(envFilePath)) {
        shell.exec(`cp --preserve ${envDefaultFilePath} ${envFilePath}`);
        logger(`env file ${envFilePath} created`);
    }
    nginx.includeAdd('letsencrypt.conf', { webroot: LETSENCRYPT_WEBROOT });
};
