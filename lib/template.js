const _ = require('lodash');
const path = require('path');
const vm = require('vm');

function render(template, context) {
    const sandbox = _.assign({ result: null }, context || {});
    const script = new vm.Script(`result = \`${template}\`;`);
    const ctx = vm.createContext(sandbox);
    script.runInContext(ctx);
    return sandbox.result;
}

function templatePath(templateName) {
    return path.resolve(__dirname, `../templates/${templateName}`);
}

module.exports = { render, templatePath };
