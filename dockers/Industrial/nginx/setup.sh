docker run \
-p 80:80 \
--name aimnginx \
-v $PWD/www:/usr/share/nginx/html \
-v $PWD/conf/nginx.conf:/etc/nginx/nginx.conf \
-v $PWD/conf/default.conf:/etc/nginx/conf.d/default.conf \
-v $PWD/logs:/var/log/nginx \
-d nginx
