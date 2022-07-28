
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

To get started, a Product needs to be created. Create one 
by navigating to the UI, "Configure" tab, and adding a product name. 

Adding a product will allow additional configuration for 
rasberry pi output pins and `Forwarding`

## Pin Configuration

Using the output pins is simple, but there are a couple of important
rules. 
- the pin output power is limited to what a raspberry pi can source. 
It is required in all cases except those of very low current to use a relay board
with external power source to drive bright lights or servos or whatever. 
- The pin numbers DO NOT map to the raspberry pi standard output pin numbers. 
raspberry pi pin numbers. They DO map to raspberry pi GPIO pin numbers. So use 1
for GPIO pin 1, and not 28 for GPIO pin 1. 

## Forwarding

Forwarding allows this LWEFD to send a notification on product status
change to another LWEFD system. This allows chaining of the systems, and is
useful when more products are configured than the raspberry pi has pins, 
but notifications are desired to go to the same endpoint. 

## Notifications

LWEFD won't do anything unless something is sending it notifications. 

There are two types of notifications: standard and value. 

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
- `full_url` (mandatory): is a location that can link to the job. This is
presented as an href in the UI.
- `number` (mandatory): can be set to any number, and can be used to 
overwrite old runs. Set to -1 for autoincrementing. 
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

For value notifications, its recommended at always use "number": -1 for
autoincrements. 


# Building

NPM manages backend dependencies, and Bower for frontend. 

    npm install
    bower install

# Running

Running LWEFD is simple, just call the main server file with node.

    node server/server.js

This will start the server with the default settings, which are in memory
database and hosting on port 3000.

The settings can be changed via the `env.json` file in the server folder.

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

To use the "production" settings, simply add a parameter.

    node server/server.js production

In this manner, additional sets of config can be added to `env.json`

## Tests

there is an NPM script to run the tests. 

    npm run test
    npm run coverage

There is also a script in the `test` folder that demonstrates how to 
load up a sample DB, or to send a notification with curl. 
