'use strict';

const request = require( 'request' ),
    config = require( '../../defaults.json' );

class YandexDns {
    addSubdomain( domain, subdomain, ip, callback ) {
        request( {
            method: 'POST',
            url: 'https://pddimp.yandex.ru/api2/admin/dns/add',
            headers: {
                PddToken: config.dns.yandex.apiKey
            },
            json: true,
            form: {
                domain,
                type: 'A',
                content: ip,
                subdomain
            }
        }, function( err, res ) {
            if( err ) return callback( err );
            if( res.statusCode != 200 ) return callback( new Error( `HTTP ${res.statusCode}` ) );
            callback();
        } );
    }
}

module.exports = YandexDns;