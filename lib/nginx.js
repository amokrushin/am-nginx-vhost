'use strict';

const _ = require( 'lodash' ),
    async = require( 'neo-async' ),
    fs = require( 'fs-extra' ),
    path = require( 'path' ),
    url = require( 'url' ),
    vm = require( 'vm' ),
    exec = require( 'child_process' ).exec,
    config = require( '../defaults.json' );

class Nginx {
    constructor( properties ) {
        this.log = properties.log;
    }

    initConf( hostname, templateName, options, callback ) {
        const templateFile = path.resolve( __dirname, `../templates/${templateName}.conf` ),
            configFile = path.join( config.nginx.path.available, hostname );

        async.waterfall( [
            _.partial( fs.readFile, templateFile, 'utf8' ),
            ( template, callback ) => {
                const sandbox = _.assign( {}, options, {hostname, result: ''} ),
                    script = new vm.Script( 'result = `' + template + '`;' ),
                    context = new vm.createContext( sandbox );
                script.runInContext( context );
                callback( null, sandbox.result );
            },
            _.partial( fs.writeFile, configFile ),
            ( callback ) => {
                this.log( '  ', `nginx vhost config write to ${configFile}`, 'ok' );
                callback();
            }
        ], callback );
    }

    enableConf( hostname, callback ) {
        const configFile = path.join( config.nginx.path.available, hostname ),
            symlink = path.join( config.nginx.path.enabled, hostname );
        async.series( [
            _.partial( fs.ensureSymlink, configFile, symlink ),
            ( callback ) => {
                this.log( '  ', `nginx ensure symlink ${symlink}`, 'ok' );
                callback();
            }
        ], callback );
    }

    test( callback ) {
        async.waterfall( [
            _.partial( exec, `nginx -t` ),
            ( err, stdout, stderr ) => {
                const out = stdout.toString() + stderr.toString();
                if( err ) return callback( err );
                if( /syntax is ok/.test( out ) && /successful/.test( out ) ) return callback();
                callback( new Error( 'nginx config test failed' ) );
            },
            ( callback ) => {
                this.log( '  ', `nginx test`, 'ok' );
                callback();
            }
        ], callback );
    }

    reload( callback ) {
        async.series( [
            _.partial( exec, `service nginx reload` ),
            ( callback ) => {
                this.log( '  ', `nginx reload`, 'ok' );
                callback();
            }
        ], callback );
    }
}

module.exports = Nginx;