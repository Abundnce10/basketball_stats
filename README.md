# Basketball Stat Tracker

This was my attempt to get a working prototype up and running (designed for a desktop device).  You can find an example [here](http://www.stattracker.me/).

Team names are stored to localstorage but any of the stats created are lost once the browser is closed.  I've determined that it's too difficult for one person to record *all* the stats of a game, so I'm going to rebuild the application to allow multiple clients to simultaneously update the same game. 

I plan to use [socket.io](http://socket.io/) and a [Node.js](http://nodejs.org/) server to allow client devices to add stats during the game and asynchronously update any other clients observing the game (e.g. Assistant Coach mode).

A large portion of the code needs to be refactored but I'm leaving it the way it is now to focus on building out the server and backend architecture.