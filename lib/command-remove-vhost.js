const Dns = require('./Dns');
const Nginx = require('./Nginx');
const Letsencrypt = require('./Letsencrypt');

// eslint-disable-next-line
const logger = console.log;
const dns = new Dns({ logger });
const nginx = new Nginx({ logger });
const letsencrypt = new Letsencrypt({ logger });

exports.builder = {
    host: {
        alias: 'h',
    },
};

exports.handler = ({ host }) => {
    dns.removeA(host, () => {});
    letsencrypt.revoke(host);
    nginx.vhostRemove(host);
    nginx.test();
    nginx.reload();
};
