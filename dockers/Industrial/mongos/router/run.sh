#!/bin/bash
set -m

cmd="mongos --configdb $replSet/mongo-conf-1:27017,mongo-conf-2:27017,mongo-conf-3:27017"

$cmd &
fg
