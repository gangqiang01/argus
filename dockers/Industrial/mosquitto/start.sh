#!/bin/bash
docker run -t -d -v $PWD/mosquitto.conf:/mosquitto/config/mosquitto.conf -p 30012:1883 -p 30013:11880 eclipse-mosquitto
