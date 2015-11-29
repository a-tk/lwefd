#!/usr/bin/env bash

SELF_URL="http://lwefd.me"

PRODUCT_NAME="LWEFD"
PRODUCT_NUM=1

create_product () {
  echo curl "http://${SELF_URL}/api/create/${PRODUCT_NAME}"
  curl "http://${SELF_URL}/api/create/${PRODUCT_NAME}"
}

submit_start () {
  curl -X POST --data @"./self.json" "http://localhost:3000/api/${i}/notify" --header "Content-Type: application/json"
}

submit_end () {
 echo
}

create_product

if [[ "$1" -e "start" ]]; then
  submit_start
elif [[ "$1" -e "end" ]]; then
  submit_end
fi
