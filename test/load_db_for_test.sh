#!/bin/bash

PRODUCT_NAME="TEST"
FILE_NAME="./notifications/testrun1.json"
ID="1"

# add test product
echo curl "http://localhost:3000/api/create/${PRODUCT_NAME}"
curl "http://localhost:3000/api/create/${PRODUCT_NAME}"
echo

for i in `seq 1 10`; do
# add POST test run
 echo curl -X POST --data @${FILE_NAME} "http://localhost:3000/api/${ID}/notify" --header "Content-Type: application/json"
 curl -X POST --data @${FILE_NAME} "http://localhost:3000/api/${ID}/notify" --header "Content-Type: application/json"
 echo
done
