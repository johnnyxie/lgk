error_log  {{config.logs.nginx.errorLog}} {{config.logs.level}};
pid        {{config.nginx.pid}};
worker_rlimit_nofile 8192;
worker_processes  {{config.nginx.noWorkers}};
daemon off;

events {
  worker_connections  4096;  ## Default: 1024
}

http {
  include    mime.types;

  map $http_upgrade $connection_upgrade {
      default upgrade;
      '' close;
  }

  index    index.html;

  default_type application/octet-stream;
  log_format   main '$remote_addr - $remote_user [$time_local]  $status '
    '"$request" $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';
  access_log   {{config.logs.nginx.accessLog}}  main;
  sendfile     on;
  tcp_nopush   on;
  server_names_hash_bucket_size 128; # this seems to be required for some vhosts

  server {
    listen {{config.nginx.httpPort}};
    access_log   {{config.logs.nginx.accessLog}}  main;
    proxy_temp_path proxy;
    sendfile  off;

    client_body_temp_path client_body_temp;

    location /api/ {
      proxy_pass http://{{config.nodeJS.host}}:{{config.nodeJS.port}}/;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
    }

    location /api/documentation {
      proxy_pass http://{{config.nodeJS.host}}:{{config.nodeJS.port}}/documentation;
    }

    location /api/swaggerui/ {
      proxy_pass http://{{config.nodeJS.host}}:{{config.nodeJS.port}}/api/swaggerui/;
    }

    location / {
      alias {{config.nginx.frontend}}/;
      proxy_pass http://{{config.nodeJS.host}}:8088/;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
    }
  }
}