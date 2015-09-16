#!/bin/bash

#docker run --name acro-redis -d -p 6378:6379 redis:3.0.4
docker start acro-redis

#docker run --name acro-memcached -d -p 11210:11211 memcached:1.4.24 -m 64
docker start acro-memcached

docker ps
