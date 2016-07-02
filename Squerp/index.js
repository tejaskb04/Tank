var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tanks = [];
var bullets = [];
var updateID;

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
        updateID = setInterval(sendTank, 5);
    });
    socket.on('sendLocalTank', function(userTank, userTankID) {
    	tanks[userTankID] = userTank;
    });
    socket.on('sendBullets', function(userBullets, bulletIDs) {
        for(i = 0; i < userBullets.length; i++) {
            bullets[bulletIDs[i]] = userBullets[i]; 
        }
        //console.log(bullets);
    });
    socket.on('appendBullet', function(bullet) {
        bullets.push(bullet);
        socket.emit('bulletID', bullets.length - 1);
    });
});

http.listen(8080, function() {
    console.log("Connecting to port 8080...");
});

function sendTank(){
	io.emit('globalTankUpdate', tanks);
    io.emit('globalBulletUpdate', bullets)
}
//REMEMBER IF BULLETS > 0   