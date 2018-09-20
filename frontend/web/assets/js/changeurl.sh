#! /bin/bash
sed  -i  's/\/golang/http:\/\/172.21.73.144:9090/g'  `grep "/golang" -rl --exclude={recoveryurl.sh,changeurl.sh}`
