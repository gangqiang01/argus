#!/bin/bash 

echo "Waiting for startup.."
until mongo --host ${MONGOS}:${PORT} --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)' &>/dev/null; do
  printf '.'
  sleep 1
done

echo "Started.."

echo init-shard.sh time now: `date +"%T" `
sleep 3
mongo --host ${MONGOS}:${PORT} <<EOF
   sh.addShard( "${RS}/${MONGO1}:${PORT1},${MONGO2}:${PORT2},${MONGO3}:${PORT3}" );
   sh.status();
EOF
