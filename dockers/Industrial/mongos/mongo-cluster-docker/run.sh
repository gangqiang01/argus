#!/bin/sh
docker-compose -f docker-compose.yml -f docker-compose.cnf.yml -f docker-compose.shard.yml $1
