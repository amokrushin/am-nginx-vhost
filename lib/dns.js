'use strict';

const _ = require( 'lodash' ),
    async = require( 'neo-async' ),
    fs = require( 'fs-extra' ),
    dns = require( 'dns' ),
    vm = require( 'vm' ),
    publicIp = require( 'public-ip' ),
    YandexDns = require( './dns/yandex' );

class Dns {
    constructor( properties ) {
        this.log = properties.log;
    }

    addSubdomain( hostname, callback ) {
        const parts = hostname.split( '.' );
        if( parts.length === 1 ) throw Error( `Invalid hostname ${hostname}` );
        if( parts.length === 2 ) return callback();
        const domain = _.slice( parts, -2 ).join( '.' ),
            subdomain = _.slice( parts, 0, -2 ).join( '.' );

        async.parallel( {
            ns: ( callback ) => dns.resolveNs( domain, callback ),
            ip: ( callback ) => publicIp.v4().then( ip=>callback( null, ip ) )
        }, ( err, {ns,ip} )=> {
            if( err ) return callback( err );
            if( ~ns[0].indexOf( 'yandex.ru' ) )
            {
                this.log( '  ', `dns domain nameservers ${ns.join( ' ' )}` );
                this.log( '  ', `dns self public ip ${ip}` );
                const api = new YandexDns();
                api.addSubdomain( domain, subdomain, ip, ( err )=> {
                    if( err ) return callback( err );
                    this.log( '  ', `dns A record ${subdomain} ${ip} added to domain ${domain}` );
                    callback();
                } );
            }
            if( ~ns[0].indexOf( 'cloudflare.com' ) )
            {
                this.log( '  ', 'Cloudflare DNS support is not implemented' );
                //callback(new Error('Cloudflare DNS support not implemented'));
                callback();
            }
        } );
    }
}

module.exports = Dns;