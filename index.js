var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tanks = [];
var userList = [];
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/canvas.html");
});

io.on('connect', function(socket) {
    socket.on('isValidUser', function(user) {
        var isValid = true;
         for(i = 0; i < user.length; i++) {
             if(userList[i] == user) {
                 isValid = false;
             }
         }
        if(isValid){
            userList.push(user);
        }
        else {
            socket.emit('requestUser');
        }
    });
    socket.emit('new player');
    socket.on('send tank', function(tank, user) {
        var userindex = userList.indexOf(user);
        if(userindex>-1){
            tanks[userindex].xpos = tank.xpos;
            tanks[userindex].ypos = tank.ypos;
        }
        socket.emit('return data', tanks, userList);// is weieieied
        
    });
    socket.on('append tank', function(tank) {
        tanks.push(tank);
    });
});

http.listen(8000, function() {
    console.log("Connecting to port 8000..."); 
});