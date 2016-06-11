'use strict';

const _ = require( 'lodash' ),
    async = require( 'neo-async' ),
    fs = require( 'fs-extra' ),
    path = require( 'path' ),
    vm = require( 'vm' ),
    exec = require( 'child_process' ).exec,
    config = require( '../defaults.json' );

class Letsencrypt {
    constructor( properties ) {
        this.log = properties.log;
    }

    install( callback ) {
        this.log( '  ', 'letsencrypt install' );
        async.series( [
            callback => this.nginxInclude( callback ),
            callback => this.ensureDirs( callback ),
            callback => this.downloadCertbot( callback ),
            callback => this.cron( callback )
        ], callback );
    }

    nginxInclude( callback ) {
        async.waterfall( [
            _.partial( fs.readFile, path.resolve( __dirname, `../templates/letsencrypt.conf` ), 'utf8' ),
            ( template, callback ) => {
                const sandbox = {webroot: config.letsencrypt.webroot, result: ''},
                    script = new vm.Script( 'result = `' + template + '`;' ),
                    context = new vm.createContext( sandbox );
                script.runInContext( context );
                callback( null, sandbox.result );
            },
            _.partial( fs.writeFile, path.join( config.nginx.path.includes, 'letsencrypt.conf' ) ),
            ( callback ) => {
                this.log( '  ', `letsencrypt write letsencrypt.conf to ${config.nginx.path.includes}`, 'ok' );
                callback();
            }
        ], callback );
    }

    ensureDirs( callback ) {
        async.series( [
            _.partial( fs.ensureDir, config.letsencrypt.webroot ),
            _.partial( fs.ensureDir, config.letsencrypt.log ),
            ( callback ) => {
                this.log( '  ', `letsencrypt ensure dir ${config.letsencrypt.webroot}`, 'ok' );
                callback();
            }
        ], callback );
    }

    downloadCertbot( callback ) {
        const certbot = path.join( config.letsencrypt.path, 'certbot-auto' );
        async.series( [
            _.partial( fs.emptyDir, config.letsencrypt.path ),
            _.partial( exec, `wget -P ${config.letsencrypt.path} ${config.letsencrypt.downloadUrl}` ),
            _.partial( exec, `chmod a+x ${certbot}` ),
            ( callback ) => {
                this.log( '  ', `letsencrypt certbot download to ${config.letsencrypt.path}`, 'ok' );
                this.log( '  ', `letsencrypt make ${certbot} executable`, 'ok' );
                callback();
            }
        ], callback );
    }

    cron( callback ) {
        const templateFile = path.resolve( __dirname, `../templates/renew.sh` ),
            bashFile = path.join( __dirname, `renew.sh` ),
            certbotFile = path.join( config.letsencrypt.path, `certbot-auto` ),
            logFile = path.join( config.letsencrypt.log, `renew.log` ),
            cronJob = [config.letsencrypt.cronTime, bashFile].join( ' ' );

        async.series( [
            _.partial( async.waterfall, [
                _.partial( fs.readFile, templateFile, 'utf8' ),
                ( template, callback ) => {
                    const sandbox = _.assign( {log: logFile, certbot: certbotFile, result: ''} ),
                        script = new vm.Script( 'result = `' + template + '`;' ),
                        context = new vm.createContext( sandbox );
                    script.runInContext( context );
                    callback( null, sandbox.result );
                },
                _.partial( fs.writeFile, bashFile )
            ] ),
            _.partial( exec, `chmod a+x ${bashFile}` ),
            _.partial( exec, `( crontab -l | grep -v "${bashFile}" ; echo "${cronJob}" ) | crontab -` ),
            ( callback ) => {
                this.log( '  ', `letsencrypt renew script write to ${bashFile}`, 'ok' );
                this.log( '  ', `letsencrypt make ${bashFile} executable`, 'ok' );
                this.log( '  ', `letsencrypt cronjob added "${cronJob}"`, 'ok' );
                callback();
            }
        ], callback );
    }

    certbot( hostname, callback ) {
        const certbot = path.join( config.letsencrypt.path, 'certbot-auto' ),
            args = [
                `certonly`,
                `--webroot -w ${config.letsencrypt.webroot}`,
                `-d ${hostname}`,
                `-m ${config.letsencrypt.email}`,
                `--keep-until-expiring`,
                `--agree-tos`,
                `--non-interactive`,
                `--quiet`
            ].join( ' ' );

        async.series( [
            callback => this.nginxInclude( callback ),
            callback => this.ensureDirs( callback ),
            callback => {
                exec( `${certbot} ${args}`, ( err, stdout, stderr )=> {
                    if( err ) return callback( err );
                    const logFile = path.join( config.letsencrypt.log, 'history.log' ),
                        errorFile = path.join( config.letsencrypt.log, 'error.log' );
                    async.parallel( [
                        cb => fs.appendFile( logFile, [new Date(), `${certbot} ${args}`, stdout].join( '\n' ), cb ),
                        cb => fs.appendFile( errorFile, [new Date(), `${certbot} ${args}`, stderr].join( '\n' ), cb )
                    ], callback )
                } );
            },
            ( callback ) => {
                this.log( '  ', `letsencrypt execute ${certbot}`, 'ok' );
                callback();
            }
        ], callback );
    }
}

module.exports = Letsencrypt;