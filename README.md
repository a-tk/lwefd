
# Light Weight Extreme Feedback Device (LWEFD)

This project is a NodeJS Express MVC app with an Angular1 frontend. 

Its purpose is to host an API that can receive notification from 
various systems and display their status on a frontend. 

![image](https://user-images.githubusercontent.com/9774560/181585646-da15d5aa-6fca-40e1-b09a-82b3d4451229.png)

This is highly useful hosted on a raspberry pi with physical lights
configured to its pinouts (also a feature of this project) to do things
like notify build or test failures. 

Conceptually, LWEFD is structured with "Product" being the highest level, 
Products have multiple "Jobs" which have multiple "Runs" 

![image](https://user-images.githubusercontent.com/9774560/181585932-2869fdac-756d-4446-9315-8f5a4b0e21db.png)

It is designed this way to fit into a larger development team
has different products, which all have different components. 

From a CI standpoint, each component's build maps to a "Job", 
and that build can be run over and over, creating runs. 

LWEFD works natively with the Jenkins Notification Plugin, otherwise, its
trivial to configure additional build steps using something like curl to 
POST the notifications. https://plugins.jenkins.io/notification

Another feature that LWEFD posseses is the ability to record
numerical data over time, and to configure control limits around that data. 

![image](https://user-images.githubusercontent.com/9774560/181586826-0a1e8ca6-15a8-46fc-8f98-f824f0b7f4ff.png)

This is highly useful in the performance testing scenario (or other 
statistical process monitoring scenario), as it provides a way to show data
overtime, along with standard deviation and other trend information. 

# Getting Started

There are two types of notificaitons: standard and value. 

Standard notifications look like this: 

    {
        "name": "testSuccess",
        "build": {
            "full_url": "http://localhost:3000",
            "number": 1,
            "phase": "COMPLETED",
            "status": "SUCCESS"
            }
    }

- `name` (mandatory): the name of the job
- `build` (mandatory): is the current information to be updated
- `full_url` (mandatory): is a location that can link to the job. This is presented as an href in the UI.
- `number` (mandatory): can be set to any number, and can be used to overwrite old runs. Set to -1 for autoincrementing. 
- `phase` (mandatory): one of `STARTED` `COMPLETED` `FINISHED` 
- `status` (mandatory): one of `SUCCESS` `UNSTABLE` `FAILURE` 

The value type notifications contain only 2 additional fields.


    {
        "name": "testValue",
        "valueUnit": "MPH"
        "build": {
            "full_url": "http://localhost:3000",
            "number": 1,
            "phase": "COMPLETED",
            "status": "SUCCESS"
            "value": 32
            }
    }

- `valueUnit` (required for value): a string to display in the UI. 
- `value` (required for value): a numerical value. 

For value notifications, its recommended at always use "number": -1 for autoincrements. 


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




