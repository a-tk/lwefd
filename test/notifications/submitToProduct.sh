#!/usr/bin/env bash

#HOST="lwefd.me"
HOST="lwefd.me"

if [ $# -ne 5 ]; then

  echo "usage: $0 <name> <number> [STARTED | COMPLETED] [FAILURE|UNSTABLE|SUCCESS|STARTED] <pid>"

else
  DATA="{\"name\":\"${1}\", \"build\": {\"full_url\":\"http://lwefd.me\", \"number\": ${2}, \"phase\":\"${3}\", \"status\":\"${4}\"}}"
  echo ${DATA}
  echo curl "http://${HOST}/api/${5}/notify" --header "Content-Type: application/json" -X POST --data ${DATA} &
  curl "http://${HOST}/api/${5}/notify" --header "Content-Type: application/json" -X POST --data "${DATA}" &
fi

