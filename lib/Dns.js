const _ = require('lodash');
const async = require('neo-async');
const dns = require('dns');
const publicIp = require('public-ip');
const YandexDns = require('./dns/yandex');

class Dns {
    constructor(options) {
        this.logger = options.logger;
    }

    info(hostname, callback) {
        const parts = hostname.split('.');
        if (parts.length === 1) throw Error(`Invalid hostname ${hostname}`);
        if (parts.length === 2) return callback();
        const domain = _.slice(parts, -2).join('.');
        const subdomain = _.slice(parts, 0, -2).join('.');

        async.parallel({
            ns: cb => dns.resolveNs(domain, cb),
            ip: cb => publicIp.v4().then(ip => cb(null, ip)),
        }, (err, { ns, ip }) => {
            let api;
            if (/yandex\.(ru|net)/.test(ns[0])) {
                this.logger(`dns ${domain} nameservers: ${ns.join(' ')}`);
                this.logger(`dns ${hostname} public IP: ${ip}`);
                api = new YandexDns();
            }
            callback(err, { domain, subdomain, ns, ip, api });
        });
    }

    addA(hostname, callback) {
        this.info(hostname, (err, { domain, subdomain, ns, ip, api }) => {
            if (err) return callback(err);
            if (api && api.addA) {
                api.addA(domain, subdomain, ip, (err) => {
                    if (err) return callback(err);
                    this.logger('  ', `dns ${domain} A record ${subdomain} ${ip} added`);
                    callback();
                });
            } else {
                this.logger(`"${ns[0]}" DNS support is not implemented`);
                callback();
            }
        });
    }

    removeA(hostname, callback) {
        this.info(hostname, (err, { domain, subdomain, ns, api }) => {
            if (err) return callback(err);
            if (api && api.list && api.removeA) {
                api.removeA(domain, subdomain, (err) => {
                    if (err) return callback(err);
                    this.logger(`dns ${domain} A record ${subdomain} removed`);
                    callback();
                });
            } else {
                this.logger(`${ns[0]} DNS support is not implemented`);
                callback();
            }
        });
    }
}

module.exports = Dns;
