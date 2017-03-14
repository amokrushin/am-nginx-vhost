const test = require('tape');
const Nginx = require('../../lib/Nginx');
const config = require('../../defaults.json');

// eslint-disable-next-line
const logger = console.log;
const nginx = new Nginx({ logger });

test('add vhost config', (t) => {
    t.ok(nginx.vhostAdd('example.com', 'http-letsencrypt'));
    t.end();
});

test('enable vhost', (t) => {
    t.ok(nginx.vhostEnable('example.com'));
    t.end();
});

test('add include', (t) => {
    t.ok(nginx.includeAdd('letsencrypt.conf', { webroot: config.letsencrypt.webroot }));
    t.end();
});


test('test configuration', (t) => {
    t.ok(nginx.test());
    t.end();
});

test('reload', (t) => {
    t.ok(nginx.reload());
    t.end();
});

test('remove include', (t) => {
    t.ok(nginx.includeRemove('letsencrypt.conf'));
    t.end();
});

test('disable vhost', (t) => {
    t.ok(nginx.vhostDisable('example.com'));
    t.end();
});

test('remove vhost config', (t) => {
    t.ok(nginx.vhostRemove('example.com'));
    t.end();
});
