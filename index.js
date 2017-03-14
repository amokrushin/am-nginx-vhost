const os = require('os');
const path = require('path');
require('dotenv').config({ path: path.resolve(os.homedir(), '.am-nginx-vhost.env') });
require('./lib/yargs')();
