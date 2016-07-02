var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tanks = [];
var updateID;

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/canvas.html");
});

io.on('connect', function(socket) {
    socket.emit('connected');
    socket.on('tankdata', function(tank) {
        if(userindex>-1){
            tanks[userindex].xpos = tank.xpos;
            tanks[userindex].ypos = tank.ypos;
        }
        
    });
    socket.on('append tank', function(tank) {
        tanks.push(tank);
    });
});

http.listen(8080, function() {
    console.log("Connecting to port 8000..."); 
});