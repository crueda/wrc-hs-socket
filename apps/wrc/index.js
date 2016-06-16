// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 7778;
var fs = require('fs');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

    console.log('Un cliente se ha conectado');
    //socket.emit('new tracking data', 'messages');

var temporal = require("temporal");
var startIndex = 0;
var endIndex = 1000;
var incrementIndex = 1;
var delay = 1500;
var tasks = [];


while ( startIndex < endIndex ) {
    tasks.push({
      delay: delay,
      task: function() {
        //console.log(Date.now());
        // do stuff

// con lectura asincrona
/*
      fs.readFile('./tracking_wrc.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }        
        socket.emit('new tracking data', {
          geojson: data
        });
      });
  
*/
// con lectura sincrona
      var data = fs.readFileSync('./tracking_wrc.json');
      console.log(data.toString());
      socket.emit('new tracking data', {
          geojson: data.toString()
        });
      

      }
    });






  startIndex = startIndex + incrementIndex;

}


temporal.queue(tasks);

    //socket.broadcast.emit('new tracking data', {
      /*
    for (var i=0; i<5; i++) {
      socket.emit('new tracking data', {
        geojson: '[{"geometry": {"type": "Point", "coordinates": [8.3167, 40.5626]}, "type": "Feature", "properties": {"alias": "FUSI Matteo", "alarm_state": "0", "license": "092", "vehicle_state": "", "pos_date": "1455455257500", "tracking_state": "STOP", "speed": 0.1000, "heading": 116.6000}}]'
      });
    }

setTimeout(function() {
  console.log('hello world!');
}, 5000);
*/

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
