#!/usr/bin/env bash

if [ $# -ne 6 ]; then

  echo "usage: $0 <name> <number> [STARTED | COMPLETED] [FAILURE|UNSTABLE|SUCCESS|STARTED] <pid> <host>"

else
  DATA="{\"name\":\"${1}\", \"build\": {\"full_url\":\"http://lwefd.me\", \"number\": ${2}, \"phase\":\"${3}\", \"status\":\"${4}\"}}"
  echo ${DATA}
  echo curl "http://${6}/api/${5}/notify" --header "Content-Type: application/json" -X POST --data ${DATA} &
  curl "http://${6}/api/${5}/notify" --header "Content-Type: application/json" -X POST --data "${DATA}" &
fi

