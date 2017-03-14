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
    port: {
        alias: 'p',
    },
};

exports.handler = ({ host, port }) => {
    if (!host) throw new Error('host undefined');
    if (!port) throw new Error('port undefined');
    dns.addA(host, () => {
        nginx.vhostAdd(host, 'http-letsencrypt');
        nginx.vhostEnable(host);
        nginx.test();
        nginx.reload();
        letsencrypt.certbot(host);
        nginx.vhostAdd(host, 'https', { port });
        nginx.test();
        nginx.reload();
    });
};
