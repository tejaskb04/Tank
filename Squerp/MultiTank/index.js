var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tanks = [];
var shots = [];
var updateID = setInterval(updateClient, 5);

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/derpy tank.html");
});

io.on('connect', function(socket) {
    socket.emit('connected');
    socket.on('append tank', function(tank) {
        tanks.push(tank);
        console.log("Added");
        console.log(tank);
        socket.emit('tankID', tanks.length - 1);
    });
    socket.on('sendLocalTank', function(userTank, userTankID) {
    	tanks[userTankID] = userTank;
    });
    socket.on('sendBullet',function(ball){
        shots.push(ball);
    })
});

http.listen(3141, function() {
    console.log("Connecting to port 8080...");
});

function updateClient(){
	io.emit('globalTankUpdate', tanks);
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

