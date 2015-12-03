#!/usr/bin/env bash

if [ $# -lt 7 ]; then

  echo "usage: $0 [v|n] <host> <pid> <name> <number> [STARTED|COMPLETED] [FAILURE|UNSTABLE|SUCCESS|STARTED] [valueUnit] [value]"

else
  if [ "$1" = "v" ]; then
    DATA="{\"name\":\"${4}\", \"valueUnit\":\"${8}\", \"build\": {\"full_url\":\"http://${2}\", \"number\": ${5}, \"phase\":\"${6}\", \"status\":\"${7}\", \"value\":${9}}}"
  else
    DATA="{\"name\":\"${4}\", \"build\": {\"full_url\":\"http://${2}\", \"number\": ${5}, \"phase\":\"${6}\", \"status\":\"${7}\"}}"
  fi
  echo ${DATA}
  echo curl "http://${2}/api/${3}/notify" --header "Content-Type: application/json" -X POST --data ${DATA} &
  curl "http://${2}/api/${3}/notify" --header "Content-Type: application/json" -X POST --data "${DATA}" &

fi

