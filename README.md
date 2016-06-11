# am-nginx-vhost

## Install
    git clone https://github.com/amokrushin/am-nginx-vhost.git
    cd am-nginx-vhost
    npm i

## Run
    node app.js

## CLI
###
    local@io~$ help
    Commands:
      help [command...]                  Provides help for a given command.
      exit                               Exits application.
      add-vhost-proxy <hostname> <port>
      letsencrypt

###
    local@io~$ letsencrypt
      letsencrypt install
      letsencrypt write letsencrypt.conf to /etc/nginx ok
      letsencrypt ensure dir /var/www/letsencrypt ok
      letsencrypt certbot download to /opt/certbot ok
      letsencrypt make /opt/certbot/certbot-auto executable ok
      letsencrypt renew script write to /srv/node_projects/am-nginx-vhost/lib/renew.sh ok
      letsencrypt make /srv/node_projects/am-nginx-vhost/lib/renew.sh executable ok
      letsencrypt cronjob added "23 */12 * * * /srv/node_projects/am-nginx-vhost/lib/renew.sh" ok

### 
    local@io~$ add-vhost-proxy test.example.com 3061
      Cloudflare DNS support is not implemented
      nginx vhost config write to /etc/nginx/sites-available/test.example.com ok
      nginx ensure symlink /etc/nginx/sites-enabled/test.example.com ok
      nginx reload ok
      letsencrypt write letsencrypt.conf to /etc/nginx ok
      letsencrypt ensure dir /var/www/letsencrypt ok
      letsencrypt execute /opt/certbot/certbot-auto ok
      nginx vhost config write to /etc/nginx/sites-available/test.example.com ok
      nginx reload ok
