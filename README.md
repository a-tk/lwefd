
# Light Weight Extreme Feedback Device (LWEFD)

This project is a NodeJS Express MVC app with an Angular1 frontend. 

Its purpose is to host an API that can receive notification from 
various systems and display their status on a frontend. 

This is highly useful hosted on a raspberry pi with physical lights
configured to its pinouts (also a feature of this project) to do things
like notify build or test failures. 

Conceptually, LWEFD is structured with "Product" being the highest level, 
Products have multiple "Jobs" which have multiple "Runs" 

It is designed this way to fit into a larger development team
has different products, which all have different components. 

From a CI standpoint, each component's build maps to a "Job", 
and that build can be run over and over, creating runs. 

LWEFD works natively with the Jenkins Notification Plugin, otherwise, its
trivial to configure additional build steps using something like curl to 
POST the notifications. https://plugins.jenkins.io/notification

Another feature that LWEFD posseses is the ability to record
numerical data over time, and to configure control limits around that data. 

This is highly useful in the performance testing scenario (or other 
statistical process monitoring scenario), as it provides a way to show data
overtime, along with standard deviation and other trend information. 

# Getting Started

The notifications look like this. 

# Building

NPM manages backend dependencies, and Bower for frontend. 
    npm install
    bower install
    node server/server.js

# Running

    {
      "development": {
          "dbFile": ":memory:",
          "port": 3000,
          "isRaspi": false
          },
          "production": {
              "dbFile": "DB.sqlite",
              "port":80,
              "isRaspi": false
              }
    }

## Tests

# Notification Examples




