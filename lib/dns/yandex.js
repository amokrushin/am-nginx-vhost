const request = require('request');
const config = require('../../defaults.json');

class YandexDns {
    addA(domain, subdomain, ip, callback) {
        request({
            method: 'POST',
            url: 'https://pddimp.yandex.ru/api2/admin/dns/add',
            headers: {
                PddToken: config.dns.yandex.apiKey,
            },
            json: true,
            form: {
                domain,
                type: 'A',
                content: ip,
                subdomain,
            },
        }, (err, res) => {
            if (err) return callback(err);
            if (res.statusCode !== 200) return callback(new Error(`HTTP ${res.statusCode}`));
            callback();
        });
    }

    list(domain, callback) {
        request({
            method: 'GET',
            url: 'https://pddimp.yandex.ru/api2/admin/dns/list',
            headers: {
                PddToken: config.dns.yandex.apiKey,
            },
            json: true,
            qs: {
                domain,
            },
        }, (err, res, body) => {
            if (err) return callback(err);
            if (res.statusCode !== 200) return callback(new Error(`HTTP ${res.statusCode}`));
            if (!Array.isArray(typeof body === 'object' && body.records)) {
                return callback(new Error('Invalid response GET https://pddimp.yandex.ru/api2/admin/dns/list'));
            }
            callback(null, body.records);
        });
    }

    removeA(domain, subdomain, callback) {
        this.list(domain, (err, records) => {
            const record = records.find(r => r.type === 'A' && r.domain === domain && r.subdomain === subdomain);
            const recordId = record && record.record_id;
            if (recordId) {
                request({
                    method: 'POST',
                    url: 'https://pddimp.yandex.ru/api2/admin/dns/del',
                    headers: {
                        PddToken: config.dns.yandex.apiKey,
                    },
                    json: true,
                    form: {
                        domain,
                        record_id: recordId,
                    },
                }, (err, res) => {
                    if (err) return callback(err);
                    if (res.statusCode !== 200) return callback(new Error(`HTTP ${res.statusCode}`));
                    callback();
                });
            } else {
                callback();
            }
        });
    }
}

module.exports = YandexDns;
