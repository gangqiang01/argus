#!/bin/bash
set -m

cmd="mongod --replSet $replSet --httpinterface --rest --shardsvr --port 27017 --oplogSize $size --smallfiles"
# --oplogSize $size --noprealloc"

cmd="$cmd --logpath /var/log/mongodb/mongodb.log"
$cmd &
fg
