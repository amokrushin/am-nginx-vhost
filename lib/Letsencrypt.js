const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const config = require('../defaults.json');

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
        fs.ensureDirSync(config.letsencrypt.webroot);
        this.logger(`letsencrypt ensure dir ${config.letsencrypt.webroot}`);
        return true;
    }

    // cron() {
    // const templateFile = path.resolve(__dirname, '../templates/renew.sh'),
    //     bashFile = path.join(__dirname, 'renew.sh'),
    //     certbotFile = path.join(config.letsencrypt.path, 'certbot-auto'),
    //     logFile = path.join(config.letsencrypt.logger, 'renew.log'),
    //     cronJob = [config.letsencrypt.cronTime, bashFile].join(' ');
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
        const certbot = config.letsencrypt.bin;
        const args = [
            'certonly',
            `--webroot -w ${config.letsencrypt.webroot}`,
            `-d ${hostname}`,
            `-m ${config.letsencrypt.email}`,
            '--keep-until-expiring',
            '--agree-tos',
            '--non-interactive',
        ].join(' ');
        const logFilePath = resolveLogPath(config.letsencrypt.log);
        const errorFilePath = resolveLogPath(config.letsencrypt.log);

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
        const certbot = config.letsencrypt.bin;
        const args = [
            'delete',
            `--cert-name ${hostname}`,
        ].join(' ');
        const { code, stdout, stderr } = shell.exec(`${certbot} ${args}`);
        const logFilePath = resolveLogPath(config.letsencrypt.log);
        const errorFilePath = resolveLogPath(config.letsencrypt.log);

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
