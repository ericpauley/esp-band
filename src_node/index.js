express = require('express');

var app = express();
var http = require('http').Server(app);
app.use(express.static('html'));
var request = require("request")
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var redis = require("redis"),
master = redis.createClient();
receiver = redis.createClient();

receiver.on("ready", function(){
  receiver.psubscribe("waveform.*")
  receiver.psubscribe("bpm.*")
  receiver.psubscribe("bpm_slow.*")
})

var io = require('socket.io')(http);

api_url = "http://apidev.accuweather.com/currentconditions/v1/335315.json?apikey=c3e7df4f2d6a40698cc75fac1b6a2c83"

function takeDp(channel, dp){
  master.rpush("historical."+channel,JSON.stringify(dp));
  master.ltrim("historical."+channel,-1000,-1);
  io.emit(channel, dp)
}

receiver.on('pmessage', function (pattern, channel, message) {
  dp = JSON.parse(message)
  if(pattern == "bpm_slow.*"){
    request({
        url: api_url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            dp.temp = body[0].Temperature.Imperial.Value
            takeDp(channel, dp)
        }
    })
  }else{
    takeDp(channel, dp)
  }

});

// io.on('connection', function(socket){
//   console.log('a user connected')
//   master.keys("historical.*", function(err,keys){
//     for(var i in keys){
//       master.lrange(keys[i],-1000,-1,function(err, items){
//         for(var j in items){
//           console.log(items[j], /historical\.(.*)/.exec(keys[i])[1])
//           socket.emit(/historical\.(.*)/.exec(keys[i])[1],JSON.parse(items[j]))
//         }
//       })
//     }
//   })
//   socket.emit("prescriptions", prescriptions)

//   socket.on('prescriptions', function(message){
//      prescriptions = message
//      io.emit("prescriptions", prescriptions)
//   });
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
