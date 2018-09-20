#!/bin/bash
set -m

cmd="mongod --replSet $replSet --configsvr --port 27017 --oplogSize $size --smallfiles"
# --oplogSize $size --noprealloc --smallfiles"

$cmd &
fg
