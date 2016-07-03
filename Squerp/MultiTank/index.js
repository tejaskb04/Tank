var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tanks = [];
var shots = [];
var socketIDs = [];
var updateID = setInterval(updateClient, 5);

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/canvas.html");
});

io.on('connect', function(socket) {
    socket.emit('connected');
    socket.on('sendMyID', function(id){
        socketIDs.push(id);
        console.log(socketIDs);
    });
    socket.on('append tank', function(tank) {
        tanks.push(tank);
        console.log("Added");
        console.log(tank);
        socket.emit('startRender');
    });
    socket.on('sendLocalTank', function(userTank, userID) {
        for(i = 0; i < socketIDs.length; i++){
            if(userID == socketIDs[i]){
                tanks[i] = userTank;
            }
        }
    });
    socket.on('sendBullet',function(ball){
        shots.push(ball);
    });
    socket.on('disconnect', function() {
        for(i = 0; i < socketIDs.length; i++){
            if(socket.id.substring(2, socket.id.length) == socketIDs[i]) {
                console.log(socket.id);
                socketIDs.splice(i, 1);
                tanks.splice(i, 1);
            }
        }
    });
});

http.listen(3141, function() {
    console.log("Connecting to port 8080...");
});

function updateClient(){
	io.emit('globalTankUpdate', tanks, socketIDs);
    for(var i = 0; i < shots.length; i++) {
        shots[i].x += shots[i].xvel;
        shots[i].y += shots[i].yvel;
        if(shots[i].y > 500 / 2 ||shots[i].y <-500 / 2) {
            shots[i].yvel = -shots[i].yvel;
        }
        if(shots[i].x > 500 /2 || shots[i].x < -500 / 2){
            shots[i].xvel = -shots[i].xvel;
        }
    }
    io.emit('globalBullets',shots);
}

