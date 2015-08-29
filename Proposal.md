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

The goal to the project will be: 
	- single page web app
	- capability to run on Raspberry Pi
	- Interface with more than one type of CI system
	- 

## Web Technologies
Node.js webserver
Ext.js MVC framework
Angular.js
Sqlite DB


## Stretch Goals

### Metrics to track each systems state over time. 
This would be used to track software development trends, like codebase health
or development capability. 

### Email capability
Would be useful to notify based on CI System health. Jenkins and Travis already can
do this though.

### GPIO Pin support for a platform like Raspberry pi

