#!/bin/bash

PRODUCT_NAME="TEST"
NOTIFICATIONS=("./notifications/testSuccess.json" "./notifications/testUnstable.json" "./notifications/testFailure.json" "./notifications/testStarted.json" "./notifications/testValue.json")
NUMBER_OF_PRODUCTS=5

createProducts () {
  for i in `seq 1 ${NUMBER_OF_PRODUCTS}`; do
    echo curl "http://localhost:3000/api/create/test${i}"
    curl "http://localhost:3000/api/create/test${i}"
  done
}

submitNotifications () {
  for i in `seq 1 ${NUMBER_OF_PRODUCTS}`; do
    for j in ${NOTIFICATIONS[@]}; do
      echo curl -X POST --data @${j} "http://localhost:3000/api/${i}/notify" --header "Content-Type: application/json" &
      curl -X POST --data @${j} "http://localhost:3000/api/${i}/notify" --header "Content-Type: application/json"  &
    done
  done
}

runTest () {

  echo ------------ SUBMIT ------------

  createProducts
  sleep 1
  echo ------------ SUBMISSION ------------
  for n in `seq 1 $1`; do
    submitNotifications
  done

  echo ------------ DONE ------------
}

runTest $1
