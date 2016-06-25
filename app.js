'use strict';

const _ = require( 'lodash' ),
    async = require( 'neo-async' ),
    vorpal = require( 'vorpal' )(),
    Nginx = require( './lib/nginx' ),
    Letsencrypt = require( './lib/letsencrypt' ),
    Dns = require( './lib/dns' );

vorpal
    .command( 'add-vhost-proxy <hostname> <port>' )
    .validate( args => {
        return _.min( [
            args.hostname.split( '.' ).length > 1,
            /^\d{2,5}$/.test( args.port )
        ] );
    } )
    .action( function( {hostname, port}, callback ) {
        const letsencrypt = new Letsencrypt( {log: _.bind( this.log, this )} ),
            nginx = new Nginx( {log: _.bind( this.log, this )} ),
            dns = new Dns( {log: _.bind( this.log, this )} );

        async.series( [
            ( callback ) => dns.addSubdomain( hostname, callback ),
            ( callback ) => setTimeout( callback, 5000 ),
            ( callback ) => nginx.initConf( hostname, 'http-letsencrypt', {}, callback ),
            ( callback ) => nginx.enableConf( hostname, callback ),
            ( callback ) => nginx.test( callback ),
            ( callback ) => nginx.reload( callback ),
            ( callback ) => letsencrypt.certbot( hostname, callback ),
            ( callback ) => nginx.initConf( hostname, 'https', {port}, callback ),
            ( callback ) => nginx.test( callback ),
            ( callback ) => nginx.reload( callback )
        ], callback );
    } );

vorpal
    .command( 'letsencrypt' )
    .action( function( args, callback ) {
        const letsencrypt = new Letsencrypt( {log: _.bind( this.log, this )} );
        async.series( [
            ( callback ) => letsencrypt.install( callback )
        ], callback );
    } );

vorpal
    .show()
    .parse( process.argv );