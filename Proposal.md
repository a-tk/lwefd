# lwefd
A Light Weight Extreme Feedback Device

## Project Title
My project&#39s title is lwefd, for Light Weight Exreme Feedback Device


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



## Web Technologies
Node.js webserver
Ext.js MVC framework
Angular.js
Sqlite DB


## Stretch Goals


