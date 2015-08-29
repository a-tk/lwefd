# lwefd
A Light Weight Extreme Feedback Device

## Project Title
My project's title is lwefd, for Light Weight Exreme Feedback Device


## Purpose
The project will be a <a href='https://en.wikipedia.org/wiki/extreme_programming'>
extreme feedback device</a> dashboard. This dashboard will aggragate notifications
from Continuous Integration servers such as Jenkins CI and Travis CI. 

The lwefd will provide a high level collection of information from each server, that 
at a glance provides development information to team members, scrum masters, and 
program managers. 

This model makes it necessary for the lwefd to be a web application, allowing
multiple simultaneous usage of the lwefd to anyone with an internet connection.

In detail, the lwefd will recieve notifications (JSON or XML) from CI systems and group these 
notifications into user defined catagories. These catagories can represent any 
thing that a user could need, such as Software components or even creative 
non-software related things, as long as the site also accepts a generic notification.

In an Internet of Things world, these general notifications could for example
notify if the dog's water is empty, or if the laundry is done. 

The system is called "light weight" because it will be designed to run on top of
simple and cheap hardware, such as Raspberry Pi, so that it is accessible to even
the smallest households or organizations. 

The goal to the project will be a single page web app, capability to run on Raspberry 
Pi, interface with more than one type of CI system, be user extensible and configurable.

lwefd manages data from each user configurable group, like a list of "jobs" that make up a 
group, and their "state". States could be what is typical of CI systems, Failed (component
failed to build) unstable (component has failing unit tests), and success (no problem). 
lwefd would then also need to keep track of the user configurable groups, and their state.
I envision that their state's would represent each jobs state as considered as a whole. 

## Web Technologies

###Node.js webserver
The base of the system.
###Ext.js MVC framework
Allow strong software development paradigms.
###Angular.js
Allow the front end to be a dynamic single page app.
###Sqlite DB
A lightweight, strong and resilient back end.


## Stretch Goals

### Metrics to track each systems state over time. 
This would be used to track software development trends, like codebase health
or development capability. 

### Email capability
Would be useful to notify based on CI System health. Jenkins and Travis already can
do this though.

### GPIO Pin support for a platform like Raspberry pi
This would allow users to plug in relays to the Raspberry Pi's GPIO pins, 
and connect these triggers to fun EFD systems, like a traffic light or 
to anything that they may want. 

### Authentication System
Since the website is hosted publically, it may need to manage who it recieves notifications
from, therefor needing a notification authentication scheme.

