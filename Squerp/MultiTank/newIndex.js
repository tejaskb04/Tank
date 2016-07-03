var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketIDs = [];
var tanks = [];
var updateID = setInterval(updateClient, 5);
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/toImplement.html");
});

io.on('connect', function(socket) {
	socket.emit('connected');
	socket.on('sendMyID', function(id){
        socketIDs.push(id);
        console.log(socketIDs);
    });
    socket.on('appendTank', function(userTank) {
        tanks.push(userTank);
        console.log("Added");
        console.log(userTank);
        socket.emit('startRender');
    });

    socket.on('sendLocalTank', function(userTank, userID) {
        for(i = 0; i < socketIDs.length; i++){
            if(userID == socketIDs[i]){
                tanks[i] = userTank;
            }
        }
    });
});

http.listen(8000, function() {
    console.log("Connecting to port 8000...");
});

function updateClient(){
	io.emit('globalTankUpdate', tanks, socketIDs);
    /*for(var i = 0; i < shots.length; i++) {
        shots[i].x += shots[i].xvel;
        shots[i].y += shots[i].yvel;
        if(shots[i].y > 500 / 2 ||shots[i].y <-500 / 2) {
            shots[i].yvel = -shots[i].yvel;
        }
        if(shots[i].x > 500 /2 || shots[i].x < -500 / 2){
            shots[i].xvel = -shots[i].xvel;
        }
    }
    io.emit('globalBullets',shots);*/
}