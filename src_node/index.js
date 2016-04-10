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
  receiver.psubscribe("pulse.*")
})

var io = require('socket.io')(http);

api_url = "http://apidev.accuweather.com/currentconditions/v1/335315.json?apikey=c3e7df4f2d6a40698cc75fac1b6a2c83"
// var getJSON = function(url, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("get", url, true);
//     xhr.responseType = "json";
//     xhr.onload = function() {
//       var status = xhr.status;
//       if (status == 200) {
//         callback(null, xhr.response);
//       } else {
//         callback(status);
//       }
//     };
//     xhr.send();
// };

receiver.on('pmessage', function (pattern, channel, message) {
  val = parseInt(message)
  process.stdout.write('hello1');
  master.rpush("historical."+channel,val);
  process.stdout.write('hello2');
  master.ltrim("historical."+channel,-1000,-1);
  process.stdout.write('hello3');

  // getJSON(api_url, function(err, data) {
  //   if (err != null) {
  //     alert("Something went wrong: " + err);
  //   } else {
  //     var obj = JSON.parse(data);
  //     process.stdout.write(data);
  //   }
  // });
  request({
      url: api_url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          // console.log(body[0].Temperature.Imperial.Value); // Print the json response
          temp = body[0].Temperature.Imperial.Value;
          console.log({val:val,temp:temp});
          io.emit(channel,{val:val,temp:temp});
      }
  })
  // getJSON(api_url.then(function(data) {
  //   var obj = JSON.parse(data.result);
  //   process.stdout.write('hello');
  //   process.stdout.write(obj.toString());
  //   message.temp = obj.Temperature.Imperial.Value
  //   io.emit(channel,message)
  // });
});

io.on('connection', function(socket){
  console.log('a user connected');
  master.set('prescrip', JSON.stringify({"Name":"adfasdfsad"}))
  master.get('prescrip', function(err, reply) {
    socket.emit("prescrip", reply)
    console.log("initial prescrip data sent to client")
  })
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
   console.log("BEEEETOOOOTCH")
   if (message === "get") {
       master.get('prescrip', function(err, reply) {
         console.log(reply);
       })
     } else {
       master.set('prescrip', JSON.stringify(message), function(err, reply) {
         console.log("New prescription details set!")
         master.get('prescrip', function(err, reply)
       {
         //socket.emit("prescrip", reply)
       })

       })
     }
   });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
