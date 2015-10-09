#Goals
Here were my goals for this checkpoint as defined before:

For this checkpoint I would really like to have a working end-to-end
backend for the site. This means for the site to be receiving notifications,
parsing them, and storing them in a sensible database. 

This is the first checkpoint with a large deliverable, but in my 
experience, it is the UI that takes the longest, and I am using a new
UI technology, so I expect for there to be some steep learning there.

This goal is all about getting backend work out of the way and functional!

#Current Status

A whole e2e workflow of my project is possible. With some caveats of course.
The highlights are set up with Travis CI for continuous integration, 
website hosting set up for lwefd.me, and a backend implementation.

My project accepts notification, and instead of any kind of sensible parsing,
it expects the fields in the notification to be there. This means simply that there
is room for improvement :)

I really like the setup of the site, it is complete with modular routing,
development and production environment configuration, object dependency
injection, and many more... this is a major highlight.

This biggest bonus from this is that I am ready to start front end work.
With my server processing notifications, and storing them, I am ready to
get to work with angular, which is what I set most of my time to be spent
on, so a major win there. 

The downside is that my DB is not fully implemented.
I decided to switch from SQLite to MongoDB, as learning a noSQL database
was something that I have never done before, and this project is all
about learning new things. 

I spent a ton of time playing with it, and trying to get it right, which cut 
into my time spent on implementation. I have got it *almost* working, and for
this checkpoint, I have opted for an in memory JSON object implementation. 

This took me about 30 minutes to create, it totally functional, and will be what I 
model my DB schema off of. The mongoDB driver for node.js is written to accept JSON
objects, so I am actually in great shape with this in memory implementation. Again,
the most important thing is that is stores and retrieves data.