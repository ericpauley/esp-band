api_url = "http://apidev.accuweather.com/currentconditions/v1/335315.json?apikey=c3e7df4f2d6a40698cc75fac1b6a2c83"

express = require('express');

var app = express();
var http = require('http').Server(app);
app.use(express.static('html'));

var redis = require("redis"),
master = redis.createClient();
receiver = redis.createClient();

receiver.on("ready", function(){
  receiver.psubscribe("waveform.*")
  receiver.psubscribe("pulse.*")
})

var io = require('socket.io')(http);

receiver.on('pmessage', function (pattern, channel, message) {
  message = parseInt(message)
  master.rpush("historical."+channel,message)
  master.ltrim("historical."+channel,-1000,-1)
  io.emit(channel,message)
});

io.on('connection', function(socket){
  console.log('a user connected');
  master.keys("historical.*", function(err,keys){
    for(var i in keys){
      master.lrange(keys[i],-1000,-1,function(err, items){
        for(var j in items){
          io.emit(/historical\.(.*)/.exec(keys[i])[1],parseInt(items[j]))
        }
      })
    }
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
