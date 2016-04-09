express = require('express');

var app = express();
var http = require('http').Server(app);
app.use(express.static('html'));

var redis = require("redis"),
sender = redis.createClient();
receiver = redis.createClient();

receiver.on("ready", function(){
  receiver.psubscribe("waveform.*")
  receiver.psubscribe("pulse.*")
})

var io = require('socket.io')(http);

receiver.on('pmessage', function (pattern, channel, message) {
  console.log(channel, message)
  io.emit({channel:channel,message:message})
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
