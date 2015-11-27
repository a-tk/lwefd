#!/bin/bash

PRODUCT_NAME="TEST"
FILE_NAME="./notifications/testrun1.json"
ID="1"

# add test product
echo curl "http://localhost:3000/api/create/${PRODUCT_NAME}"
curl "http://localhost:3000/api/create/${PRODUCT_NAME}"
echo

echo -------------------- blocking submission ---------------------
for i in `seq 1 5`; do
# add POST test run
 echo curl -X POST --data @${FILE_NAME} "http://localhost:3000/api/${ID}/notify" --header "Content-Type: application/json"
 curl -X POST --data @${FILE_NAME} "http://localhost:3000/api/${ID}/notify" --header "Content-Type: application/json"
 echo
done

echo sleep 2
sleep 2

echo -------------------- non-blocking submission ---------------------
for i in `seq 1 5`; do
# add POST test run
 echo curl -X POST --data @${FILE_NAME} "http://localhost:3000/api/${ID}/notify" --header "Content-Type: application/json" &
 curl -X POST --data @${FILE_NAME} "http://localhost:3000/api/${ID}/notify" --header "Content-Type: application/json" &
 echo
done
