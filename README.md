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

## Example

```
am@135775:~$ sudo vhost add -h blog.mokr.org -p 2368
dns mokr.org nameservers: dns2.yandex.ru dns1.yandex.ru
dns blog.mokr.org public IP: 85.143.221.54
dns mokr.org A record blog 85.143.221.54 added
nginx vhost blog.mokr.org config written to /etc/nginx/sites-available/blog.mokr.org
nginx vhost blog.mokr.org enabled /etc/nginx/sites-enabled/blog.mokr.org
nginx test: ok
nginx reload: ok
letsencrypt ensure dir /var/www/letsencrypt
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for blog.mokr.org
Using the webroot path /var/www/letsencrypt for all unmatched domains.
Waiting for verification...
Cleaning up challenges
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/blog.mokr.org/fullchain.pem. Your cert will
   expire on 2017-09-10. To obtain a new or tweaked version of this
   certificate in the future, simply run certbot again. To
   non-interactively renew *all* of your certificates, run "certbot
   renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

letsencrypt blog.mokr.org certificate created
nginx vhost blog.mokr.org config written to /etc/nginx/sites-available/blog.mokr.org
nginx test: ok
nginx reload: ok

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
