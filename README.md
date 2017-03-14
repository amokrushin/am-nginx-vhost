# am-nginx-vhost
[![NPM Stable Version][npm-stable-version-image]][npm-url]
[![Build Status][travis-master-image]][travis-url]
[![Test Coverage][codecov-image]][codecov-url-master]
[![Dependency Status][david-image]][david-url-master]
[![Node.js Version][node-version-image]][node-version-url]
[![License][license-image]][license-url]

## Install
    npm i am-nginx-vhost -g

## Usage

```bash
vhost <cmd> [args]

Commands:
  init    init
  add     add vhost [host] [port]
  remove  remove vhost [host]

Options:
  --help  Show help

Example:
  vhost --help
  sudo vhost init
  sudo vhost add -h test.example.org -p 1234
  sudo vhost remove -h test.example.org
```


[npm-stable-version-image]: https://img.shields.io/npm/v/am-nginx-vhost.svg
[npm-url]: https://npmjs.com/package/am-nginx-vhost
[travis-master-image]: https://img.shields.io/travis/amokrushin/am-nginx-vhost/master.svg
[travis-url]: https://travis-ci.org/amokrushin/am-nginx-vhost
[codecov-image]: https://img.shields.io/codecov/c/github/amokrushin/am-nginx-vhost/master.svg
[codecov-url-master]: https://codecov.io/github/amokrushin/am-nginx-vhost?branch=master
[david-image]: https://img.shields.io/david/amokrushin/am-nginx-vhost.svg
[david-url-master]: https://david-dm.org/amokrushin/am-nginx-vhost
[node-version-image]: https://img.shields.io/node/v/am-nginx-vhost.svg
[node-version-url]: https://nodejs.org/en/download/
[license-image]: https://img.shields.io/npm/l/am-nginx-vhost.svg
[license-url]: https://raw.githubusercontent.com/amokrushin/am-nginx-vhost/master/LICENSE.txt
