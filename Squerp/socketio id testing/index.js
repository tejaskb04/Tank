var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 var socketIDs = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on('connect', function(socket) {
    socket.emit('connected');
    socket.on('returnSocket', function(id){
    	socketIDs.push(id);
    	console.log(id + " pushed to");
    	console.log(socketIDs);
    });
});

http.listen(8000, function() {
    console.log("Connecting to port 8080...");
});


