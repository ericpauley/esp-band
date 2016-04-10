api_url = "http://apidev.accuweather.com/currentconditions/v1/335315.json?apikey=c3e7df4f2d6a40698cc75fac1b6a2c83"
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

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
  message = {val:parseInt(message)}
  master.rpush("historical."+channel,message)
  master.ltrim("historical."+channel,-1000,-1)
  getJSON(api_url).then(function(data) {
    var obj = JSON.parse(data.result);
    message.temp = obj.Temperature.Imperial.Value
    io.emit(channel,message)
  });
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

socket.on('prescrip', function(message){
  if (message === "get") {
    master.get('prescrip', function(err, reply)) {
      console.log(reply);
    }
  } else {
    master.set('prescrip', message, function(err, reply) {
      console.log("New prescription details set!")
    }
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
