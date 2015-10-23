#Goal
This should be the first UI checkpoint. I'd like to have a functioning 
dashboard page, along with a nice looking jobs page (the page that will
show all of the aggregated notifications). I have some great ideas for
displaying this information in an AJAX-y way, and I would like to have
time for that. 
#Current Status
A real DB has been implemented and an Angular frontend exists. I have added a dashboard page, 
angular driven routing, and end to end information sharing between the backend and client.
The DB is SQLite, I just didn't have the time to do a full Mongo impl, and I think
that SQLite will offer better performance on a Raspberry Pi, which is a stretch goal of this
project.

I am not to my goal of a 'nice looking jobs page,' but well on my way. Jobs are displayed 
from the DB if they exist. This beget the usage of a configuration page that can add products, and
configure various aspects of them. This is in the works, so stay tuned!

