#!/bin/bash
docker rm AIMgo
docker run -it --name AIMgo -v $PWD/go:/go -v $PWD/run.sh:/run.sh -p 9090:9090  -d golang /bin/bash -c '/run.sh;bash'
