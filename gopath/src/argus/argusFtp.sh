#!/bin/bash
go build argus
/usr/bin/expect <<EOF
set timeout 5000
spawn ftp 47.95.248.121
expect "Name" {send "advantech\n"}
expect "Password" {send "advantech\n"}
expect  "ftp>" 
send "put argus\n"
expect  "ftp>"
send "quit\n"
EOF
echo "fpt end"
