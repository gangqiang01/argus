#! /bin/bash
sed  -i  's/http:\/\/172.21.73.144:9090/\/golang/g'  `grep "http:\/\/172.21.73.144:9090"  -rl --exclude={recoveryurl.sh,changeurl.sh}`
