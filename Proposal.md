# lwefd
A Light Weight Extreme Feedback Device

## Project Title
My project's title is lwefd, for Light Weight Exreme Feedback Device


## Purpose
The purpose of my project is to provide a high level dashboard primarily for 
multiple continuous integrations systems. In a more general sense, this project
can serve as a high level dashboard for anything that can send it a notification.

This project has a general use case, but let me use a specific use case to 
illistrate what this project is and why it is useful. 

You are a student and are working on three different mid-size team projects. 
For one of the projects, the team is using TravisCI as a Continuous Integration platform.
The codebase has 16 distinct components.
The two projects use a Jenkins CI system, and are smaller, but not insignifigantly so. 
The only way that I know that each project is in good health is to go to each individual
CI system, and look at every component to see if they are passing. 

Now comes the lwefd. If I host a webserver that recieves notifications of each CI system 
whenever each of them builds a component, then I can know in one moment if each project 
has passing or failing tests, broken components, and why. All without knowing the 
technical details of each CI system. 

This type of system could also be very useful to managers in a software engineering shop.
The managers could then use this dashboard to gain a quick view of how there codebase is 
doing, and whether or not there needs to be action items. 

Such a system will need to track each component's notifications, and update its web
front-end with information based on the notification. The project will then need to 
understand notifications from Jenkins and Travis CI, or support a general notification
packet, which plugins could be written for Travis CI and Jenkins. A general notification
packet would be essential for aggregating generic notifications in one place. 

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

