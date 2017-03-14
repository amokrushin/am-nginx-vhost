const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

const { LETSENCRYPT_BIN, LETSENCRYPT_WEBROOT, LETSENCRYPT_LOG, LETSENCRYPT_EMAIL } = process.env;

function resolveLogPath(logPath) {
    const _logPath = path.isAbsolute(logPath)
        ? logPath
        : path.join(process.cwd(), logPath);
    fs.ensureFileSync(_logPath);
    return _logPath;
}

class Letsencrypt {
    constructor(options) {
        this.logger = options.logger;
    }

    ensureDirs() {
        fs.ensureDirSync(LETSENCRYPT_WEBROOT);
        this.logger(`letsencrypt ensure dir ${LETSENCRYPT_WEBROOT}`);
        return true;
    }

    // cron() {
    // const templateFile = path.resolve(__dirname, '../templates/renew.sh'),
    //     bashFile = path.join(__dirname, 'renew.sh'),
    //     certbotFile = path.join(config.letsencrypt.path, 'certbot-auto'),
    //     logFile = path.join(LETSENCRYPT_LOGger, 'renew.log'),
    //     cronJob = [LETSENCRYPT_CRONTIME, bashFile].join(' ');
    //
    // async.series([
    //     _.partial(async.waterfall, [
    //         _.partial(fs.readFile, templateFile, 'utf8'),
    //         (template, callback) => {
    //             const sandbox = _.assign({ log: logFile, certbot: certbotFile, result: '' }),
    //                 script = new vm.Script(`result = \`${template}\`;`),
    //                 context = new vm.createContext(sandbox);
    //             script.runInContext(context);
    //             callback(null, sandbox.result);
    //         },
    //         _.partial(fs.writeFile, bashFile),
    //     ]),
    //     _.partial(exec, `chmod a+x ${bashFile}`),
    //     _.partial(exec, `( crontab -l | grep -v "${bashFile}" ; echo "${cronJob}" ) | crontab -`),
    //     (callback) => {
    //         this.logger('  ', `letsencrypt renew script write to ${bashFile}`, 'ok');
    //         this.logger('  ', `letsencrypt make ${bashFile} executable`, 'ok');
    //         this.logger('  ', `letsencrypt cronjob added "${cronJob}"`, 'ok');
    //         callback();
    //     },
    // ], callback);
    // }

    certbot(hostname) {
        const certbot = LETSENCRYPT_BIN;
        const args = [
            'certonly',
            `--webroot -w ${LETSENCRYPT_WEBROOT}`,
            `-d ${hostname}`,
            `-m ${LETSENCRYPT_EMAIL}`,
            '--keep-until-expiring',
            '--agree-tos',
            '--non-interactive',
        ].join(' ');
        const logFilePath = resolveLogPath(LETSENCRYPT_LOG);
        const errorFilePath = resolveLogPath(LETSENCRYPT_LOG);

        this.ensureDirs();

        const { code, stdout, stderr } = shell.exec(`${certbot} ${args}`);
        if (code) {
            this.logger(`letsencrypt error: ${certbot} ${args}`);
            throw new Error(stderr);
        }

        fs.appendFileSync(logFilePath, [new Date(), `${certbot} ${args}`, stdout].join('\n'));
        fs.appendFileSync(errorFilePath, [new Date(), `${certbot} ${args}`, stderr].join('\n'));

        this.logger(`letsencrypt ${hostname} certificate created`);
    }

    revoke(hostname) {
        const certbot = LETSENCRYPT_BIN;
        const args = [
            'delete',
            `--cert-name ${hostname}`,
        ].join(' ');
        const { code, stdout, stderr } = shell.exec(`${certbot} ${args}`);
        const logFilePath = resolveLogPath(LETSENCRYPT_LOG);
        const errorFilePath = resolveLogPath(LETSENCRYPT_LOG);

        if (code) {
            this.logger(`letsencrypt error: ${certbot} ${args}`);
            // throw new Error(stderr);
        }

        fs.appendFileSync(logFilePath, [new Date(), `${certbot} ${args}`, stdout].join('\n'));
        fs.appendFileSync(errorFilePath, [new Date(), `${certbot} ${args}`, stderr].join('\n'));

        this.logger(`letsencrypt ${hostname} certificate revoked`);
    }
}

module.exports = Letsencrypt;
