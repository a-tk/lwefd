#!/bin/bash

mongod --smallfiles --dbpath=/var/lib/mongo --logpath=/var/log/mongodb/mongod.log --logappend
