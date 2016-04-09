express = require('express');

var app = express();
var http = require('http').Server(app);
app.use(express.static('html'));

var redis = require("redis"),
sender = redis.createClient();
receiver = redis.createClient();

receiver.on("ready", function(){
  receiver.subscribe("waveform.*")
  receiver.subscribe("pulse.*")
})

var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
