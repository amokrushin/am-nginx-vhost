/* eslint-disable global-require */
const yargs = require('yargs');

module.exports = () => yargs
    .usage('$0 <cmd> [args]')
    .command('init', 'init', require('./command-init'))
    .command('add', 'add vhost [host] [port]', require('./command-add-vhost'))
    .command('remove', 'remove vhost [host]', require('./command-remove-vhost'))
    .help()
    .argv;
